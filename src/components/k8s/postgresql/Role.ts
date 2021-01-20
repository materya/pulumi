import * as pulumi from '@pulumi/pulumi'
import * as postgresql from '@pulumi/postgresql'
import * as random from '@pulumi/random'

export interface PostgresqlRoleArgs {
  login?: boolean
  name?: pulumi.Input<string>
  password?: pulumi.Input<string>
}

export class PostgresqlRole extends pulumi.ComponentResource {
  public readonly login: boolean

  public readonly name: pulumi.Output<string>

  public readonly password: pulumi.Output<string | undefined>

  public readonly role: postgresql.Role

  constructor (
    name: string,
    args: PostgresqlRoleArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:PostgresqlUser', name, {}, opts)

    const {
      login = false,
      name: roleName = name,
      password = new random.RandomString(`${name}-password`, {
        length: 32,
        minNumeric: 6,
        minUpper: 6,
        special: false,
      }, { parent: this }).result,
    } = args

    this.login = login
    this.name = pulumi.output(roleName)
    this.password = pulumi.secret(password)
    this.role = new postgresql.Role(`${name}-role`, {
      password,
      login,
      name: roleName,
    }, { parent: this })

    this.registerOutputs({
      role: this.role,
    })
  }

  getConnectionUrl ({ dbHost, dbName }: {
    dbHost: pulumi.Input<string>
    dbName: pulumi.Input<string>
  }): pulumi.Output<string> {
    return pulumi.secret(pulumi.all([this.name, this.password, dbHost, dbName])
      .apply(([username, password, host, name]) => (
        `postgres://${username}:${password}@${host}/${name}`
      )))
  }
}
