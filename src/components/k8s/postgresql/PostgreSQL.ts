import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'
import * as outputApi from '@pulumi/kubernetes/types/output'
import { PostgreSqlUser } from './PostgreSqlUser'
import { usersGenerator, databasesGenerator } from './generators'

const labels = {
  component: 'materya',
  provisioner: 'pulumi',
  tier: 'backend',
  service: 'postgresql',
  type: 'data',
}

const config: pulumi.Config = new pulumi.Config('k8s:postgresql')
const password: string | undefined = config.get('password')

export interface PostgreSqlArgs {
  password?: string
  nodeSelector?: {}
  slaveReplicas?: number
  users?: Array<PostgreSqlUser>
  databases?: Array<string>
  initScripts?: { [filename: string]: string }
  image: {
    registry?: string
    repository?: string
    tag?: string
  }
  persistence: {
    size?: string
  }
}

export class PostgreSQL extends pulumi.ComponentResource {
  public readonly service: pulumi.Output<outputApi.meta.v1.ObjectMeta>

  constructor (
    name: string,
    args: PostgreSqlArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:PostgreSQL', name, {}, opts)

    const users = args.users
      ? usersGenerator({ users: args.users })
      : ''
    const databases = args.databases
      ? databasesGenerator({ databases: args.databases })
      : ''

    const initdbScriptsConfigMap = new k8s.core.v1.ConfigMap(
      `${name}-initdb-scripts-configmap`,
      {
        metadata: { labels },
        data: {
          ...args.initScripts,
          ...(args.databases && {
            '100_create_databases.sql': databases,
          }),
          ...(args.users && {
            '200_create_users.sql': users,
          }),
        },
      },
      { parent: this },
    )

    const replicationUser = new PostgreSqlUser(`${name}-user-replication`, {
      username: 'replication',
    }, { parent: this })

    const chart = new k8s.helm.v2.Chart(`${name}-chart`, {
      fetchOpts: { repo: 'https://charts.bitnami.com/bitnami' },
      version: '3.9.1',
      chart: 'postgresql',
      values: {
        image: {
          registry: args.image.registry || 'docker.io',
          repository: args.image.repository || 'bitnami/postgresql',
          tag: args.image.tag || 'latest',
        },
        postgresqlPassword: password || args.password,
        replication: {
          enabled: true,
          user: replicationUser.username,
          password: replicationUser.password,
          slaveReplicas: args.slaveReplicas || 1,
          applicationName: name,
        },
        persistence: {
          size: (args.persistence && args.persistence.size) || '8Gi',
        },
        ...(args.nodeSelector && {
          master: {
            nodeSelector: args.nodeSelector,
          },
          slave: {
            nodeSelector: args.nodeSelector,
          },
        }),
        initdbScriptsConfigMap: initdbScriptsConfigMap
          .metadata.apply((m: outputApi.meta.v1.ObjectMeta) => m.name),
      },
    },
    { parent: this })

    this.service = chart.getResourceProperty(
      'v1/Service',
      `${name}-postgresql`,
      'metadata',
    )
    this.registerOutputs({
      service: this.service,
    })
  }
}
