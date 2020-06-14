// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require('./package.json')

module.exports = {
  extends: [
    'materya/pulumi',
    'materya/typescript',
  ],
  rules: {
    'import/no-unresolved': ['error', { ignore: [name] }],
  },
}
