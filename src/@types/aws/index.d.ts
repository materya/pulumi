declare module '@materya/pulumi' {
  namespace Aws {
    type RecordType = 'A' | 'AAAA' | 'CNAME' | 'NS' | 'MX' | 'TXT'

    interface ZoneRecord {
      prefix?: string
      type: RecordType
      ttl: number
      records?: Array<string>
    }
  }
}
