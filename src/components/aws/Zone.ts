import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import type { Aws } from '@materya/pulumi'

export interface ZoneArgs extends aws.route53.ZoneArgs {
  domain?: string
  records?: Array<Aws.ZoneRecord>
}

export class Zone extends pulumi.ComponentResource {
  public readonly id: pulumi.Output<string>

  public readonly name: string

  public readonly nameServers: pulumi.Output<Array<string>>

  constructor (
    name: string,
    args: ZoneArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:aws:Zone', name, {}, opts)

    const { domain = name, records = [], ...zoneArgs } = args

    const zone = new aws.route53.Zone(`${name}-zone`, {
      name: domain,
      ...zoneArgs,
    }, { parent: this })

    records.map((record, index) => (
      new aws.route53.Record(`${name}-record-${index}-${record.type}`, {
        name: `${record.prefix ? `${record.prefix}.` : ''}${domain}`,
        records: record.records,
        ttl: record.ttl,
        type: record.type,
        zoneId: zone.zoneId,
      }, { parent: this })
    ))

    const domainParts = Zone.getDomainParts(domain)

    if (domainParts) {
      aws.route53.getZone({
        name: domainParts.domain,
      }, { parent: this, async: true }).then(parentZone => (
        new aws.route53.Record(`${name}-parent-ns-record`, {
          name: domain,
          records: [
            zone.nameServers[0],
            zone.nameServers[1],
            zone.nameServers[2],
            zone.nameServers[3],
          ],
          ttl: 600,
          type: 'NS',
          zoneId: parentZone.zoneId,
        }, { parent: this })
      ))
    }

    this.id = zone.zoneId
    this.name = name
    this.nameServers = zone.nameServers

    this.registerOutputs({
      id: zone.zoneId,
    })
  }

  static getDomainParts = (fqdn: string):
    { subdomain: string; domain: string } | null => {
    const parts = fqdn.match(/^(?<subdomain>\w+)\.(?<domain>\w+\.\w+)$/)

    if (!parts) return null

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    return {
      subdomain: parts!.groups!.subdomain,
      domain: parts!.groups!.domain,
    }
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  }
}
