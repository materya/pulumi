import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'
import { PostgreSqlUser } from './PostgreSqlUser'
import {
  databasesGenerator,
  pgpoolUsersGenerator,
  usersGenerator,
} from './generators'

const labels = {
  component: 'materya',
  provisioner: 'pulumi',
  tier: 'backend',
  service: 'postgresql',
  type: 'data',
}

const config: pulumi.Config = new pulumi.Config('postgresql-ha')
const adminPassword = config.get('adminPassword')
const repmgrPassword = config.get('repmgrPassword')
const diskSize = config.get('diskSize')

export interface PostgreSqlArgs {
  users?: Array<PostgreSqlUser>
  databases?: Array<string>
  database?: pulumi.Input<string>
  username?: pulumi.Input<string>
  password?: pulumi.Input<string>
  initScripts?: { [filename: string]: string }
  nodeSelector?: pulumi.Input<Record<string, string>>
  persistence?: {
    size?: string
  }
}

export class PostgreSQL extends pulumi.ComponentResource {
  public readonly connectionUrl: string

  public readonly chart: k8s.helm.v2.Chart

  public readonly poolService: pulumi.Output<k8s.core.v1.Service>

  public readonly psqlService: pulumi.Output<k8s.core.v1.Service>

  constructor (
    name: string,
    args: PostgreSqlArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:PostgreSQL', name, {}, opts)

    const {
      database = 'postgres',
      nodeSelector,
      username = 'postgres',
      password = adminPassword,
    } = args

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
      values: {
        fullnameOverride: name,
        pgpool: {
          adminPassword,
          nodeSelector,
          adminUsername: 'admin',
          initdbScripts: pgpoolInitdbScripts,
        },
        postgresql: {
          database,
          labels,
          nodeSelector,
          password,
          repmgrPassword,
          username,
          initdbScripts: postgresqlInitdbScripts,
          postgresPassword: adminPassword,
        },
        persistence: {
          size: args.persistence?.size ?? diskSize ?? '10Gi',
        },
      },
    }, { parent: this })

    this.psqlService = chart.getResource(
      'v1/Service',
      `${name}-postgresql`,
    )
    this.poolService = chart.getResource(
      'v1/Service',
      `${name}-pgpool`,
    )

    this.chart = chart
    this.connectionUrl = `postgres://${username}:${password}@${name}-pgpool/postgres`

    this.registerOutputs({
      chart: this.chart,
      connectionUrl: this.connectionUrl,
      poolService: this.poolService,
      psqlService: this.psqlService,
    })
  }
}
