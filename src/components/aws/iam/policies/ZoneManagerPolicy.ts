import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

const createPolicy = (
  hostedZoneId?: string,
): pulumi.Output<aws.iam.GetPolicyDocumentResult> => (
  pulumi.output(aws.iam.getPolicyDocument({
    statements: [
      {
        actions: ['route53:ChangeResourceRecordSets'],
        effect: 'Allow',
        resources: [
          hostedZoneId ?? 'arn:aws:route53:::hostedzone/*',
        ],
      },
      {
        actions: ['route53:GetChange'],
        effect: 'Allow',
        resources: [
          'arn:aws:route53:::change/*',
        ],
      },
      {
        actions: [
          'route53:ListHostedZones',
          'route53:ListResourceRecordSets',
        ],
        effect: 'Allow',
        resources: ['*'],
      },
    ],
  }))
)

export default createPolicy
