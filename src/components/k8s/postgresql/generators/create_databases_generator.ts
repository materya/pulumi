const generator = (args: { databases: Array<string> }): string => (
  args.databases.reduce(
    (script, database) => (
      `${script}
      CREATE DATABASE ${database};
      REVOKE ALL ON DATABASE ${database} FROM PUBLIC;
      \\c ${database};
      REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
      `.replace(/^\s+$/gm, '')
    ),
    '',
  )
)

export default generator
