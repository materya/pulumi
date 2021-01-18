import * as pulumi from '@pulumi/pulumi'
import * as postgresql from '@pulumi/postgresql'
import * as random from '@pulumi/random'

type ObjectType =
  | 'function'
  | 'sequence'
  | 'table'
  | 'type'

type Privileges = Array<string>

type Grants = Record<ObjectType, Privileges>

const defaultPrivileges: Grants = {
  table: [
    'UPDATE',
    'REFERENCES',
    // 'TRUNCATE',
    'SELECT',
    'DELETE',
    'TRIGGER',
    'INSERT',
  ],
  sequence: [
    'USAGE',
    'SELECT',
    // 'UPDATE',
  ],
  function: [
    'EXECUTE',
  ],
  type: [
    'USAGE',
  ],
}

export interface PostgresqlUserArgs {
  password?: pulumi.Input<string>
  privileges?: pulumi.Input<Grants>
  schema?: pulumi.Input<string>
  username: pulumi.Input<string>
}

export class PostgresqlUser extends pulumi.ComponentResource {
  public readonly name: string

  public readonly password: pulumi.Output<string | undefined>

  public readonly role: postgresql.Role

  public readonly username: pulumi.Output<string>

  constructor (
    name: string,
    args: PostgresqlUserArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:PostgresqlUser', name, {}, opts)

    const {
      password = new random.RandomString(`${name}-password`, {
        length: 32,
        minNumeric: 6,
        minUpper: 6,
        special: false,
      }, { parent: this }).result,
      username,
    } = args

    const role = new postgresql.Role(`${name}-role`, {
      password,
      login: true,
      name: username,
    }, { parent: this })

    this.name = name
    this.username = role.name
    this.password = role.password
    this.role = role

    this.registerOutputs({
      password: this.password,
      username: this.username,
    })
  }

  setPrivileges ({
    database,
    schema,
    owner = this.role.name,
    privileges = defaultPrivileges,
  }: {
    database: postgresql.Database
    schema: postgresql.Schema
    owner?: pulumi.Input<string>
    privileges?: Grants
  }): void {
    Object.keys(privileges).forEach(objectType => {
      const _privs = new postgresql.DefaultPrivileges(
        `${this.name}-${objectType}-default-privs`,
        {
          database: database.name,
          privileges: privileges[objectType as ObjectType],
          schema: schema.name,
          objectType,
          owner,
          role: this.role.name,
        },
        {
          parent: this,
          dependsOn: [this.role, database, schema],
        },
      )

      if (objectType !== 'type') {
        const _grants = new postgresql.Grant(
          `${this.name}-${objectType}-grants`,
          {
            database: database.name,
            privileges: privileges[objectType as ObjectType],
            schema: schema.name,
            objectType,
            role: this.role.name,
          },
          {
            parent: this,
            dependsOn: [this.role, database, schema],
          },
        )
      }
    })
  }

  getConnectionUrl ({ dbHost, dbName }: {
    dbHost: pulumi.Input<string>
    dbName: pulumi.Input<string>
  }): pulumi.Output<string> {
    return pulumi.all([this.role.name, this.role.password, dbHost, dbName])
      .apply(([username, password, host, name]) => (
        `postgres://${username}:${password}@${host}/${name}`
      ))
  }
}
