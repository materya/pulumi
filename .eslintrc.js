// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require('./package.json')

module.exports = {
  extends: [
    'materya/pulumi',
    'materya/typescript',
  ],
  overrides: [
    /* Global overrides */
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
      },
    },
  ],
  rules: {
    'import/no-unresolved': ['error', { ignore: [name] }],
    '@typescript-eslint/naming-convention': ['error',
      {
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
        selector: 'default',
        trailingUnderscore: 'forbid',
      },

      /**
       * Match no-unused-vars config on explicit unused vars with a leading `_`
       */
      {
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        modifiers: ['unused'],
        selector: ['variable', 'parameter'],
        trailingUnderscore: 'forbid',
      },

      /**
       * Special members convention as PascalCase
       */
      {
        format: ['PascalCase'],
        selector: ['enumMember', 'typeLike'],
      },

      /**
       * More formats allowed for object literal
       */
      {
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'forbid',
        selector: ['objectLiteralProperty'],
        trailingUnderscore: 'forbid',
      },
    ],
  },
}
