import * as carbon from '@materya/carbon'
import * as k8s from '@pulumi/kubernetes'
import * as postgresql from '@pulumi/postgresql'
import * as pulumi from '@pulumi/pulumi'
import * as random from '@pulumi/random'

export type PostgresqlUserCredentials = {
  [username: string]: pulumi.Input<string>
}

export interface PostgresqlArgs {
  chartValuesOverride?: pulumi.Inputs
  defaults?: {
    adminPassword?: pulumi.Input<string>
    databaseName?: string
    version?: string
  }
  labels?: Record<string, string>
  namespace?: string
  nodeSelector?: pulumi.Input<Record<string, string>>
  users: PostgresqlUserCredentials
}

export class Postgresql extends pulumi.ComponentResource {
  public readonly adminPassword: pulumi.Output<string>

  public readonly adminConnectionUrl: pulumi.Output<string>

  public readonly chart: k8s.helm.v2.Chart

  public readonly poolDeployment: pulumi.Output<k8s.apps.v1.Deployment>

  public readonly poolHost: pulumi.Output<string>

  public readonly poolService: pulumi.Output<k8s.core.v1.Service>

  public readonly provider: postgresql.Provider

  public readonly psqlService: pulumi.Output<k8s.core.v1.Service>

  public readonly repmgrPassword: pulumi.Output<string>

  constructor (
    name: string,
    args: PostgresqlArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:PostgreSQL', name, {}, opts)

    const chartContext = {
      name: 'postgresql-ha',
      repository: 'https://charts.bitnami.com/bitnami',
      version: '6.3.6',
    }

    const labels = {
      provisioner: 'pulumi',
      module: 'materya',
      ...args.labels,
      tier: 'backend',
      service: 'postgresql',
      type: 'data',
    }

    const {
      chartValuesOverride,
      defaults: defaultProps = {},
      nodeSelector,
      namespace = 'default',
    } = args

    const {
      adminPassword = new random
        .RandomString(`${name}-adminPassword`, {
          length: 32,
          minNumeric: 6,
          minUpper: 6,
          special: false,
        }, { parent: this }).result,
      databaseName = 'postgres',
      version = '12.3.0',
    } = defaultProps

    this.repmgrPassword = new random.RandomString(`${name}-repmgrPassword`, {
      length: 32,
      minNumeric: 6,
      minUpper: 6,
      special: false,
    }, { parent: this }).result

    if (namespace !== 'default') {
      const _namespace = new k8s.core.v1.Namespace(`namespace-${namespace}`, {
        metadata: {
          name: namespace,
        },
      }, { parent: this })
    }

    const pgpoolSecretData = Object.entries(args.users)
      .reduce((data, user) => (
        pulumi
          .all([user[0], user[1], data.usernames, data.passwords])
          .apply(([username, password, usernames, passwords]) => (
            {
              usernames: [username, usernames].filter(Boolean).join(';'),
              passwords: [password, passwords].filter(Boolean).join(';'),
            }
          ))
      ), pulumi.output({ usernames: '', passwords: '' }))

    const pgpoolSecret = new k8s.core.v1.Secret(`${name}-pgpool-secret`, {
      stringData: pgpoolSecretData,
      metadata: {
        name: `${name}-pgpool-secret`,
      },
    }, { parent: this })

    const chartValues = {
      fullnameOverride: name,
      pgpool: {
        adminPassword,
        nodeSelector,
        customUsersSecret: pgpoolSecret.metadata.name,
      },
      postgresql: {
        labels,
        nodeSelector,
        database: databaseName,
        password: adminPassword,
        postgresPassword: adminPassword,
        repmgrPassword: this.repmgrPassword,
        username: 'postgres',
      },
      postgresqlImage: {
        tag: version,
      },
      persistence: {
        size: '20Gi',
      },
    }

    this.chart = new k8s.helm.v2.Chart(name, {
      namespace,
      chart: chartContext.name,
      fetchOpts: { repo: chartContext.repository },
      values: chartValuesOverride
        ? carbon.tools.merge(chartValues, chartValuesOverride)
        : chartValues,
      version: chartContext.version,
    }, { parent: this })

    this.psqlService = this.chart.getResource(
      'v1/Service',
      namespace,
      `${name}-postgresql`,
    )
    this.poolService = this.chart.getResource(
      'v1/Service',
      namespace,
      `${name}-pgpool`,
    )

    this.poolDeployment = this.chart.getResource(
      'apps/v1/Deployment',
      namespace,
      `${name}-pgpool`,
    )

    this.adminPassword = pulumi.secret(adminPassword)

    this.adminConnectionUrl = pulumi
      .secret(`postgres://postgres:${adminPassword}@${name}-pgpool/postgres`)

    this.poolHost = pulumi
      .all([this.poolService.metadata.name])
      .apply(([poolSvc]) => (`${poolSvc}.${namespace}.svc.cluster.local`))

    this.provider = new postgresql.Provider(`${name}-provider`, {
      expectedVersion: version,
      // host: this.poolHost,
      host: '127.0.0.1',
      superuser: true,
      username: 'postgres',
      password: adminPassword,
      sslmode: 'disable',
    }, { parent: this })

    this.registerOutputs({
      adminConnectionUrl: this.adminConnectionUrl,
      chart: this.chart,
      poolDeployment: this.poolDeployment,
      poolService: this.poolService,
      poolHost: this.poolHost,
      provider: this.provider,
      psqlService: this.psqlService,
      reprmgrPassword: this.repmgrPassword,
    })
  }
}
