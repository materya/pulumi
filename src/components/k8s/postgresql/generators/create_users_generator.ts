import * as pulumi from '@pulumi/pulumi'
import { Output } from '@pulumi/pulumi'
import { PostgreSqlUser } from '../PostgreSqlUser'

type UserGenerator = (args: {
  users: Array<PostgreSqlUser>
}) => Output<string> | string

const generator: UserGenerator = args => (
  args.users.reduce(
    (concatScript: pulumi.Output<string> | string, user) => (
      pulumi
        .all([
          concatScript,
          user.username,
          user.password,
          user.database,
          user.isAdmin,
        ])
        .apply(([script, username, password, database, isAdmin]) => (
          `${script}
          CREATE USER ${username} WITH PASSWORD '${password}';
          ${database
            ? `\\c ${database};
              GRANT ${isAdmin ? 'ALL PRIVILEGES' : 'CONNECT'}
                ON DATABASE ${database}
                TO ${username};
              ${user.tables
            ? `GRANT ${user.permissions.join(', ')}
                  ON ${user.tables.join(', ')} IN SCHEMA public
                  TO ${username};`
            : ''
          }`
            : ''
          }`.replace(/^\s+$/gm, '')
        ))
    ),
    '',
  )
)

export default generator
