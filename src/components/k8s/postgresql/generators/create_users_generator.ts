import * as pulumi from '@pulumi/pulumi'
import { Output } from '@pulumi/pulumi'
import { PostgreSqlUser } from '../PostgreSqlUser'

type UserGenerator = (args: {
  users: Array<PostgreSqlUser>
}) => Output<string> | string

// eslint-disable indent
const generator: UserGenerator = args => (
  args.users.reduce((concatScript: pulumi.Output<string> | string, user) => (
    pulumi
      .all([
        concatScript,
        user.username,
        user.password,
        user.database,
        user.isAdmin,
      ])
      .apply(([script, username, password, database, isAdmin]) => {
        const grantAccess = `
          GRANT ${isAdmin ? 'ALL PRIVILEGES' : 'CONNECT'}
          ON DATABASE ${database}
          TO ${username};
          GRANT USAGE ON SCHEMA public TO ${username};
          GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${username};
        `

        const grantPermissions = `
          GRANT ${user.permissions.join(', ')}
          ON ${user.tables ? user.tables.join(', ') : 'ALL TABLES'}
          IN SCHEMA public
          TO ${username};
          ALTER DEFAULT PRIVILEGES IN SCHEMA public
          GRANT ${user.permissions.join(', ')} ON TABLES
          TO ${username};
        `

        return `${script}
          CREATE USER ${username} WITH PASSWORD '${password}';

          ${database ? `\\c ${database}
            ${grantAccess}
            ${user.permissions ? grantPermissions : ''}` : ''}
        `.replace(/^\s+$/gm, '')
      })
  ), '')
)

export default generator
