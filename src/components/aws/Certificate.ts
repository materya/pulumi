import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

export interface CertificateArgs {
  zoneId: pulumi.Input<string>
  hostname: pulumi.Input<string>
  aliases?: Array<string | pulumi.Input<string>>
}

export class Certificate extends pulumi.ComponentResource {
  public readonly arn: pulumi.Output<string>

  constructor (
    name: string,
    args: CertificateArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:aws:Certificate', name, {}, opts)

    /**
     * Custom Provider.
     * Per AWS, ACM certificate must be in the us-east-1 region.
     */
    const eastRegionProvider = new aws.Provider(`${name}-us-east-provider`, {
      ...(aws.config.profile && {
        profile: aws.config.profile,
      }),
      ...(aws.config.accessKey && aws.config.secretKey && {
        accessKey: aws.config.accessKey,
        secretKey: aws.config.secretKey,
      }),
      region: 'us-east-1',
    }, { parent: this })

    /**
     * Request a new Certificate
     */
    const certificate = new aws.acm.Certificate(`${name}-certificate`, {
      domainName: args.hostname,
      subjectAlternativeNames: args.aliases,
      validationMethod: 'DNS',
    }, { parent: this, provider: eastRegionProvider })

    /**
     * Create DNS Records as a proof we own the domain
     */
    const records = certificate.domainValidationOptions
      .apply(options => options.map(option => (
        new aws.route53.Record(`${name}-record-${option.domainName}`, {
          name: option.resourceRecordName,
          zoneId: args.zoneId,
          type: option.resourceRecordType,
          records: [option.resourceRecordValue],
          ttl: 600,
        }, { parent: this })
      )))

    /**
     * Special resource that waits for ACM to complete validation
     * via the DNS records.
     */
    const certValidation = new aws.acm.CertificateValidation(
      `${name}-validation`,
      {
        certificateArn: certificate.arn,
        validationRecordFqdns: records.apply(rcds => rcds.map(r => r.fqdn)),
      },
      { parent: this, provider: eastRegionProvider },
    )

    this.arn = certValidation.certificateArn

    this.registerOutputs({
      arn: certValidation.certificateArn,
    })
  }
}
