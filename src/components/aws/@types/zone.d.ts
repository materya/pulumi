declare namespace zone {
  type RecordType = 'A' | 'AAAA' | 'CNAME' | 'NS' | 'MX' | 'TXT'

  interface ZoneRecord {
    prefix?: string
    type: RecordType
    ttl: number
    records?: Array<string>
  }
}

export = zone
export as namespace zone
