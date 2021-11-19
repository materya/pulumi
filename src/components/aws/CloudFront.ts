import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import type { cloudfront } from '@pulumi/aws/types/input'

export interface CloudFrontArgs {
  aliases: Array<string>
  bucket: aws.s3.Bucket
  certificateArn: pulumi.Input<string>
  customErrorResponses?: pulumi.Input<
    cloudfront.DistributionCustomErrorResponse
  >[]
  logs?: boolean
  ttl?: number
  zoneId: pulumi.Input<string>
}

export class CloudFront extends pulumi.ComponentResource {
  public readonly cloudFrontDomain: pulumi.Output<string>

  public readonly cloudFrontId: pulumi.Output<string>

  public readonly cloudFrontArn: pulumi.Output<string>

  public readonly logsBucketName?: pulumi.Output<string>

  public readonly oaiArn: pulumi.Output<string>

  public readonly targetDomain: pulumi.Output<string>

  constructor (
    name: string,
    args: CloudFrontArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:aws:CloudFront', name, {}, opts)

    const {
      aliases,
      bucket,
      certificateArn,
      customErrorResponses = [
        {
          errorCode: 404,
          responseCode: 404,
          responsePagePath: '/404.html',
        },
      ],
      logs = false,
      ttl = 600,
    } = args

    let logsBucket: aws.s3.Bucket | undefined

    if (logs) {
      logsBucket = new aws.s3.Bucket(`${name}-logs`, {
        bucket: pulumi.interpolate`${bucket.bucket}-logs`,
        acl: 'private',
        forceDestroy: true,
      }, { parent: this })
    }

    const oai = new aws.cloudfront.OriginAccessIdentity(`${name}-oai`, {
      comment: `${name} managed OAI`,
    }, { parent: this })

    const distributionArgs: aws.cloudfront.DistributionArgs = pulumi
      .all([oai.cloudfrontAccessIdentityPath]).apply(([oaiPath]) => ({
        enabled: true,
        aliases,

        // We only specify one origin for this distribution, the S3 bucket.
        origins: [
          {
            domainName: bucket.bucketDomainName,
            originId: bucket.arn,
            s3OriginConfig: {
              originAccessIdentity: oaiPath,
            },
            // customOriginConfig: {
            //   originProtocolPolicy: 'http-only',
            //   httpPort: 80,
            //   httpsPort: 443,
            //   originSslProtocols: ['TLSv1.2'],
            // },
          },
        ],

        defaultRootObject: 'index.html',

        defaultCacheBehavior: {
          targetOriginId: bucket.arn,

          viewerProtocolPolicy: 'redirect-to-https',
          allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
          cachedMethods: ['GET', 'HEAD', 'OPTIONS'],

          forwardedValues: {
            cookies: { forward: 'none' },
            queryString: false,
          },

          minTtl: 0,
          defaultTtl: ttl,
          maxTtl: ttl,
        },

        // "All" is the most broad distribution, and also the most expensive.
        // "100" is the least broad, and also the least expensive.
        priceClass: 'PriceClass_100',

        customErrorResponses,

        restrictions: {
          geoRestriction: {
            restrictionType: 'none',
          },
        },

        viewerCertificate: {
          acmCertificateArn: certificateArn,
          sslSupportMethod: 'sni-only',
        },

        ...(logsBucket && {
          loggingConfig: {
            bucket: logsBucket.bucketDomainName,
            includeCookies: false,
            prefix: pulumi.interpolate`${bucket.bucket}/`,
          },
        }),
      }))

    const distribution = new aws.cloudfront.Distribution(
      `${name}-distribution`,
      distributionArgs,
      { parent: this },
    )

    aliases.map(aliase => (
      new aws.route53.Record(`${name}-record-${aliase}`, {
        name: aliase,
        zoneId: args.zoneId,
        type: 'A',
        aliases: [
          {
            name: distribution.domainName,
            zoneId: distribution.hostedZoneId,
            evaluateTargetHealth: true,
          },
        ],
      }, { parent: this })
    ))

    this.cloudFrontDomain = distribution.domainName
    this.cloudFrontId = distribution.id
    this.cloudFrontArn = distribution.arn
    this.logsBucketName = logsBucket?.bucket
    this.oaiArn = oai.iamArn
    this.targetDomain = pulumi.interpolate`https://${bucket.bucket}`

    this.registerOutputs({
      cloudFrontDomain: this.cloudFrontDomain,
      cloudFrontId: this.cloudFrontId,
      cloudFrontArn: this.cloudFrontArn,
      logsBucketName: this.logsBucketName,
      oaiArn: this.oaiArn,
      targetDomain: this.targetDomain,
    })
  }
}
