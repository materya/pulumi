import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

export interface ZoneArgs {
  domain: string
  parentZone?: pulumi.Input<string>
}

export class Zone extends pulumi.ComponentResource {
  public readonly nameServers: pulumi.Output<Array<string>>

  constructor (
    name: string,
    args: ZoneArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:gcp:Zone', name, {}, opts)

    const zone = new gcp.dns.ManagedZone(`${name}-zone`, {
      name,
      dnsName: `${args.domain}.`,
      description: `${args.domain} Zone`,
    }, { parent: this })

    const _parentRecordSet = args.parentZone && new gcp.dns.RecordSet(
      `${name}-ns-recordset`,
      {
        name: `${args.domain}.`,
        managedZone: args.parentZone,
        ttl: 300,
        type: 'NS',
        rrdatas: zone.nameServers,
      },
      { parent: this },
    )

    this.nameServers = zone.nameServers
    this.registerOutputs({
      nameServers: zone.nameServers,
    })
  }
}
