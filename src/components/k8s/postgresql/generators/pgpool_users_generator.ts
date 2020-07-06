import * as pulumi from '@pulumi/pulumi'
import { Output } from '@pulumi/pulumi'
import { PostgreSqlUser } from '../PostgreSqlUser'

type PgpoolInitGenerator = (args: {
  users: Array<PostgreSqlUser>
}) => Output<string> | string

const generator: PgpoolInitGenerator = args => {
  const users = args.users.map(user => (
    pulumi.all([user.username, user.password])
      .apply(([username, password]) => `"${username}:${password}"`)
  )).reduce((acc, user) => (
    pulumi.interpolate`${acc} ${user}`
  ), pulumi.output(''))

  return pulumi.interpolate`
    #!/bin/bash

    USERS=(${users})

    for user in "\${USERS[@]}"; do
        user_info=(\${user//:/ })
        pg_md5 -m --config-file="/opt/bitnami/pgpool/conf/pgpool.conf" \\
          -u "\${user_info[0]}" "\${user_info[1]}"
    done
  `
}

export default generator
