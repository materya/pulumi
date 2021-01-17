import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

export interface IdentityArgs {
  policies?: { [key: string]: string | aws.ARN }
  customPolicy?: pulumi.Input<string | aws.iam.PolicyDocument>
}

export class Identity extends pulumi.ComponentResource {
  public readonly roleARN: pulumi.Output<string>

  public readonly accessKeyId: pulumi.Output<string>

  public readonly secretAccessKey: pulumi.Output<string>

  constructor (
    name: string,
    args: IdentityArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:aws:Identity', name, {}, opts)

    const user = new aws.iam.User(`${name}-user`, {
      name,
    }, { parent: this })

    const key = new aws.iam.AccessKey(`${name}-key`, {
      user: user.name,
    }, { parent: this })

    const role = new aws.iam.Role(`${name}-role`, {
      name: `${name}-role`,
      description: `${name} dedicated role`,
      assumeRolePolicy: user.arn.apply(arn => (
        aws.iam.assumeRolePolicyForPrincipal({ AWS: arn })
      )),
    }, { parent: this })

    if (args.customPolicy) {
      const _customPolicy = new aws.iam.RolePolicy(`${name}-role-policy`, {
        name: `${name}-role-policy`,
        role,
        policy: args.customPolicy,
      }, { parent: this })
    }

    if (args.policies) {
      Object.entries(args.policies).map(([policy, arn]) => (
        new aws.iam.RolePolicyAttachment(`${name}-${policy}-rpa`, {
          role,
          policyArn: arn,
        }, { parent: this })
      ))
    }

    this.roleARN = role.arn
    this.accessKeyId = key.id
    this.secretAccessKey = key.secret

    this.registerOutputs({
      roleARN: this.roleARN,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    })
  }
}
