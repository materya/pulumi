import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

const createIamPolicy = (
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

const createAssumeRolePolicy = (
  oidcIssuer: string,
  serviceAccountName: string,
  serviceRole: aws.iam.Role,
  namespace = 'default',
): pulumi.Output<aws.iam.GetPolicyDocumentResult> => {
  const current = pulumi.output(aws.getCallerIdentity({ async: true }))
  const { accountId } = current
  const oidcProvider = oidcIssuer.replace(/^https:\/\//, '')

  return pulumi.all([accountId, serviceRole.arn]).apply(([id, roleArn]) => (
    aws.iam.getPolicyDocument({
      statements: [
        {
          actions: ['sts:AssumeRoleWithWebIdentity'],
          conditions: [
            {
              test: 'StringEquals',
              variable: `${oidcProvider}:sub`,
              values: [
                `system:serviceaccount:${namespace}:${serviceAccountName}`,
              ],
            },
          ],
          effect: 'Allow',
          principals: [
            {
              identifiers: [
                `arn:aws:iam::${id}:oidc-provider/${oidcProvider}`,
              ],
              type: 'Federated',
            },
          ],
        },
        {
          actions: ['sts:AssumeRole'],
          effect: 'Allow',
          principals: [
            { identifiers: [roleArn], type: 'AWS' },
          ],
        },
      ],
    })))
}

const createRole = (
  parent: pulumi.ComponentResource,
  name: string,
  oidcIssuer: string,
  serviceAccountName: string,
  serviceRole: aws.iam.Role,
  hostedZoneId?: string,
  namespace?: string,
): pulumi.Output<aws.iam.Role> => {
  const policy = createIamPolicy(hostedZoneId)
  const assumeRolePolicy = createAssumeRolePolicy(
    oidcIssuer,
    serviceAccountName,
    serviceRole,
    namespace,
  )

  const role: pulumi.Output<aws.iam.Role> = pulumi
    .all([policy.json, assumeRolePolicy.json])
    .apply(([jsonPolicy, jsonRole]) => {
      const appliedRole = new aws.iam.Role(name, {
        name,
        description: 'external-dns service dedicated role',
        assumeRolePolicy: jsonRole,
      }, { parent })

      const $rolePolicy = new aws.iam.RolePolicy(`${name}-policy`, {
        name: `${name}-policy`,
        role,
        policy: jsonPolicy,
      }, { parent })

      return appliedRole
    })

  return role
}

export { createRole }
