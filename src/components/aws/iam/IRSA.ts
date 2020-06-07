import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

export interface IrsaArgs {
  namespace?: pulumi.Input<string>
  oidcIssuer: pulumi.Input<string>
  policy: pulumi.Input<aws.iam.GetPolicyDocumentResult>
  serviceAccountName: pulumi.Input<string>
  serviceRole: aws.iam.Role
}

export class IRSA extends pulumi.ComponentResource {
  public readonly role: aws.iam.Role

  constructor (
    name: string,
    args: IrsaArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:aws:iam:IRSA', name, {}, opts)

    const {
      // namespace = 'default',
      // oidcIssuer,
      policy,
      serviceRole,
      // serviceAccountName,
    } = args

    const trustPolicy = pulumi.all([
      args.namespace || 'default',
      args.oidcIssuer,
      args.serviceAccountName,
    ]).apply(([namespace, oidcIssuer, serviceAccountName]) => (
      IRSA.createTrustPolicy(
        oidcIssuer,
        serviceAccountName,
        serviceRole,
        namespace,
      )
    ))

    this.role = new aws.iam.Role(name, {
      name,
      description: `${name} `,
      assumeRolePolicy: trustPolicy.json,
    }, { parent: this })

    const $rolePolicy = new aws.iam.RolePolicy(`${name}-policy`, {
      name: `${name}-policy`,
      role: this.role,
      policy: pulumi.output(policy).json,
    }, { parent: this })

    this.registerOutputs({
      role: this.role,
    })
  }

  static createTrustPolicy = (
    oidcIssuer: string,
    serviceAccountName: string,
    serviceRole: aws.iam.Role,
    namespace: string,
  ): pulumi.Output<aws.iam.GetPolicyDocumentResult> => {
    // retrieve current authenticated accountId
    const { accountId } = pulumi.output(aws.getCallerIdentity({ async: true }))

    const oidcProvider = oidcIssuer.replace(/^https:\/\//, '')

    return pulumi.all([
      accountId,
      serviceRole.arn,
    ]).apply(([id, roleArn]) => (
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
      })
    ))
  }
}
