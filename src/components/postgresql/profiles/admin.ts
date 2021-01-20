import * as pulumi from '@pulumi/pulumi'

import { Privileges } from '../Privileges'

export interface AdminArgs {
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
}

export class Admin extends Privileges {
  constructor (
    name: string,
    args: AdminArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    const {
      database,
      role,
      schema,
      owner = args.role,
    } = args

    super(name, {
      database,
      owner,
      role,
      schema,
      privileges: {
        database: [
          'CONNECT',
          'CREATE',
          'TEMPORARY',
        ],
        function: [
          'EXECUTE',
        ],
        sequence: [
          'SELECT',
          'UPDATE',
          'USAGE',
        ],
        table: [
          'DELETE',
          'INSERT',
          'REFERENCES',
          'SELECT',
          'TRIGGER',
          'TRUNCATE',
          'UPDATE',
        ],
        type: [
          'USAGE',
        ],
      },
    }, opts)
  }
}
