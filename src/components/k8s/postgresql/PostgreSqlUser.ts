import * as pulumi from '@pulumi/pulumi'
import * as random from '@pulumi/random'

export interface PostgreSqlUserArgs {
  username: string
  password?: string
  database?: string
  isAdmin?: boolean
  tables?: Array<string>
  permissions?: Array<string>
}

export class PostgreSqlUser extends pulumi.ComponentResource {
  public readonly username: pulumi.Output<string>

  public readonly password: pulumi.Output<string>

  public readonly database: pulumi.Output<string | null>

  public readonly isAdmin: pulumi.Output<boolean>

  public readonly tables?: Array<string>

  public readonly permissions: Array<string>

  constructor (
    name: string,
    args: PostgreSqlUserArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:PostgreSQL:User', name, {}, opts)

    this.username = pulumi.Output.create(args.username)
    this.password = pulumi.Output.create(
      args.password
      || new random.RandomString(
        `${name}-password`,
        {
          length: 32,
          lower: true,
          minLower: 0,
          upper: true,
          minUpper: 8,
          number: true,
          minNumeric: 8,
          special: false,
        },
        { parent: this },
      ).result.apply((p: string) => p),
    )
    this.database = pulumi.Output.create(args.database || null)
    this.isAdmin = pulumi.Output.create(args.isAdmin || false)
    this.tables = args.tables || undefined
    this.permissions = args.permissions || ['ALL PRIVILEGES']
  }
}
