import * as pulumi from '@pulumi/pulumi'
import * as postgresql from '@pulumi/postgresql'
import * as random from '@pulumi/random'

export interface PostgresqlUserArgs {
  username: pulumi.Input<string>
  password?: pulumi.Input<string>
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

    this.role = new postgresql.Role(`${name}-role`, {
      password,
      login: true,
      name: username,
    }, { parent: this })

    this.name = name
    this.username = this.role.name
    this.password = this.role.password

    this.registerOutputs({
      role: this.role,
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
