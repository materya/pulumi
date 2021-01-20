import * as pulumi from '@pulumi/pulumi'
import * as postgresql from '@pulumi/postgresql'

type DatabasePrivilege =
  | 'CONNECT'
  | 'CREATE'
  | 'TEMPORARY'

type FunctionPrivilege =
  | 'EXECUTE'

// type SchemaPrivilege =
//   | 'CREATE'
//   | 'USAGE'

type SequencePrivilege =
  | 'SELECT'
  | 'UPDATE'
  | 'USAGE'

type TablePrivilege =
  | 'DELETE'
  | 'INSERT'
  | 'REFERENCES'
  | 'SELECT'
  | 'TRIGGER'
  | 'TRUNCATE'
  | 'UPDATE'

type TypePrivilege =
  | 'USAGE'

type DefaultPrivileges = {
  function?: FunctionPrivilege[]
  sequence?: SequencePrivilege[]
  table?: TablePrivilege[]
  type?: TypePrivilege[]
}

type GrantPrivileges = {
  database?: DatabasePrivilege[]
  function?: FunctionPrivilege[]
  sequence?: SequencePrivilege[]
  table?: TablePrivilege[]
}

type ObjectType = keyof DefaultPrivileges | keyof GrantPrivileges

export interface PrivilegesArgs {
  /**
   * The database to grant privileges on for this role.
   */
  readonly database: pulumi.Input<string>
  /**
   * The list of privileges to apply.
   */
  readonly privileges: DefaultPrivileges & GrantPrivileges
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
}

/**
 * Possible object type :
 *
 * - Default: `table`, `sequence`, `function`, `type`
 * - Grant: `database`, `schema`, `table`, `sequence`, `function`
 */
export class Privileges extends pulumi.ComponentResource {
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
  public readonly grants: postgresql.Grant[]

  constructor (
    name: string,
    args: PrivilegesArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:postgresql:Privileges', name, {}, opts)

    const {
      database,
      role,
      schema,
      owner = args.role,
      privileges,
    } = args

    this.defaultPrivileges = (Object.keys(privileges) as Array<ObjectType>)
      .filter(objectType => objectType !== 'database')
      .map(objectType => (
        new postgresql.DefaultPrivileges(`${name}-default-${objectType}`, {
          database,
          objectType,
          owner,
          role,
          schema,
          privileges: privileges[objectType] || [],
        }, { parent: this })
      ))

    this.grants = (Object.keys(privileges) as Array<ObjectType>)
      .filter(objectType => objectType !== 'type')
      .map(objectType => (
        new postgresql.Grant(`${name}-grant-${objectType}`, {
          database,
          objectType,
          role,
          schema,
          privileges: privileges[objectType] || [],
        }, { parent: this })
      ))

    this.database = pulumi.output(database)
    this.owner = pulumi.output(owner)
    this.role = pulumi.output(role)
    this.schema = pulumi.output(schema)

    this.registerOutputs({
      privs: this.defaultPrivileges,
      grants: this.grants,
    })
  }
}
