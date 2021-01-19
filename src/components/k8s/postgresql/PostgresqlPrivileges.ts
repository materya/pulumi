import * as pulumi from '@pulumi/pulumi'
import * as postgresql from '@pulumi/postgresql'

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

export interface PostgresqlPrivilegesArgs {
  /**
   * The database to grant privileges on for this role.
   */
  readonly database: pulumi.Input<string>
  /**
   * the name of the role to grant privileges on.
   */
  readonly role: pulumi.Input<string>
  /**
   * The database schema to grant privileges on for this role.
   */
  readonly schema: pulumi.Input<string>
  /**
   * Role for which apply default privileges (You can change default privileges only for objects that will be created by yourself or by roles that you are a member of).
   */
  readonly owner?: pulumi.Input<string>
  /**
   * The list of privileges to apply as default privileges.
   */
  readonly privileges?: Grants
}

export class PostgresqlPrivileges extends pulumi.ComponentResource {
  /**
   * The database which privileges have been granted on for this role.
   */
  public readonly database: pulumi.Output<string>

  /**
   * The list of privileges applied as default privileges.
   */
  public readonly defaultPrivileges: postgresql.DefaultPrivileges[]

  /**
   * Role for which default privileges have been applied to.
   */
  public readonly owner: pulumi.Output<string>

  /**
   * the name of the role privileges have been granted on.
   */
  public readonly role: pulumi.Output<string>

  /**
   * The database schema privileges have been granted on for this role.
   */
  public readonly schema: pulumi.Output<string>

  /**
   * Grant rule applied to this role.
   */
  public readonly grant?: postgresql.Grant

  constructor (
    name: string,
    args: PostgresqlPrivilegesArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:PostgresqlPrivileges', name, {}, opts)

    const {
      database,
      owner = args.role,
      role,
      schema,
      privileges = defaultPrivileges,
    } = args

    this.defaultPrivileges = (Object.keys(privileges) as Array<ObjectType>)
      .filter(objectType => objectType !== 'type')
      .map(objectType => (
        new postgresql.DefaultPrivileges(`${role}-deflt-privs-${objectType}`, {
          database,
          objectType,
          owner,
          role,
          schema,
          privileges: privileges[objectType],
        }, { parent: this })
      ))

    if (privileges.type) {
      this.grant = new postgresql.Grant(`${role}-grant`, {
        database,
        schema,
        role,
        objectType: 'type',
        privileges: privileges.type,
      }, { parent: this })
    }

    this.database = pulumi.output(database)
    this.owner = pulumi.output(owner)
    this.role = pulumi.output(role)
    this.schema = pulumi.output(schema)
  }
}
