import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import * as random from '@pulumi/random'

import { PostgreSqlUser } from './PostgreSqlUser'
import {
  databasesGenerator,
  pgpoolUsersGenerator,
  usersGenerator,
} from './generators'

const config: pulumi.Config = new pulumi.Config('postgresql-ha')

const labels = {
  component: 'materya',
  provisioner: 'pulumi',
  tier: 'backend',
  service: 'postgresql',
  type: 'data',
}

export interface PostgreSqlArgs {
  users: Array<PostgreSqlUser>
  databases: Array<string>
  adminUsername?: pulumi.Input<string>
  adminPassword?: pulumi.Input<string>
  initScripts?: { [filename: string]: string }
  namespace?: string
  nodeSelector?: pulumi.Input<Record<string, string>>
  persistence?: {
    size?: string
  }
  repmgrPassword?: pulumi.Input<string>
  version?: '12.3.0' | '11.8.0' | '10.13.0' | '9.6.18'
}

export class PostgreSQL extends pulumi.ComponentResource {
  public readonly adminConnectionUrl: pulumi.Output<string>

  public readonly chart: k8s.helm.v2.Chart

  public readonly namespace: string

  public readonly poolHost: string

  public readonly poolService: pulumi.Output<k8s.core.v1.Service>

  public readonly psqlService: pulumi.Output<k8s.core.v1.Service>

  constructor (
    name: string,
    args: PostgreSqlArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:PostgreSQL', name, {}, opts)

    let repmgrPassword = args.repmgrPassword ?? config.get('repmgrPassword')
    const {
      namespace = 'default',
      nodeSelector,
      adminUsername = 'postgres',
      adminPassword = config.get('adminPassword'),
      version = '12.3.0',
    } = args
    const diskSize = args.persistence?.size ?? config.get('repmgrPassword')

    if (!repmgrPassword) {
      const randomRepmgrPwd = new random.RandomString(`${name}-repmgrPwd`, {
        length: 32,
        minNumeric: 6,
        minUpper: 6,
        special: false,
      }, { parent: this })
      repmgrPassword = randomRepmgrPwd.result
    }

    const users = args.users
      ? usersGenerator({ users: args.users })
      : ''
    const databases = args.databases
      ? databasesGenerator({ databases: args.databases })
      : ''

    const postgresqlInitdbScripts = {
      ...args.initScripts,
      ...(args.databases && {
        '100_create_databases.sql': databases,
      }),
      ...(args.users && {
        '200_create_users.sql': users,
      }),
    }

    const pgpoolInitdbScripts = {
      ...(args.users && {
        'pgpool_users.sh': pgpoolUsersGenerator({ users: args.users }),
      }),
    }

    const chart = new k8s.helm.v2.Chart(name, {
      fetchOpts: { repo: 'https://charts.bitnami.com/bitnami' },
      version: '3.2.3',
      chart: 'postgresql-ha',
      namespace,
      values: {
        fullnameOverride: name,
        pgpool: {
          adminPassword,
          nodeSelector,
          adminUsername,
          initdbScripts: pgpoolInitdbScripts,
        },
        postgresql: {
          database: 'postgres',
          labels,
          nodeSelector,
          password: adminPassword,
          repmgrPassword,
          username: adminUsername,
          initdbScripts: postgresqlInitdbScripts,
          postgresPassword: adminPassword,
        },
        postgresqlImage: {
          tag: version,
        },
        persistence: {
          size: args.persistence?.size ?? diskSize ?? '10Gi',
        },
      },
    }, { parent: this })

    this.psqlService = chart.getResource(
      'v1/Service',
      namespace,
      `${name}-postgresql`,
    )
    this.poolService = chart.getResource(
      'v1/Service',
      namespace,
      `${name}-pgpool`,
    )

    this.chart = chart

    this.namespace = namespace

    this.poolHost = `${name}-pgpool.${namespace}.svc.cluster.local`

    this.adminConnectionUrl = pulumi.interpolate`postgres://${adminUsername}:${adminPassword}@${this.poolHost}/postgres`

    this.registerOutputs({
      adminConnectionUrl: this.adminConnectionUrl,
      chart: this.chart,
      namespace: this.namespace,
      poolHost: this.poolHost,
      poolService: this.poolService,
      psqlService: this.psqlService,
    })
  }

  connectionUrl (user: PostgreSqlUser, dbname: string): pulumi.Output<string> {
    return pulumi
      .all([user.username, user.password, this.poolHost])
      .apply(([username, password, poolHost]) => (
        `postgres://${username}:${password}@${poolHost}/${dbname}`
      ))
  }
}
