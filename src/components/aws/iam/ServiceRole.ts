import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { ServicePrincipal } from '@pulumi/aws/iam'

export interface ServiceRoleArgs {
  service: ServicePrincipal['Service']
  customPolicy?: pulumi.Input<string | aws.iam.PolicyDocument>
  policies?: Record<string, string | aws.ARN>
}

export class ServiceRole extends pulumi.ComponentResource {
  public readonly role: aws.iam.Role

  constructor (
    name: string,
    args: ServiceRoleArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:aws:iam:ServiceRole', name, {}, opts)

    const role = new aws.iam.Role(`${name}-role`, {
      name: `${name}-role`,
      description: `${name} dedicated role`,
      assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
        Service: args.service,
      }),
    }, { parent: this })

    if (args.customPolicy) {
      const _customPolicy = new aws.iam.RolePolicy(`${name}-policy`, {
        name: `${name}-policy`,
        role,
        policy: args.customPolicy,
      }, { parent: this })
    }

    if (args.policies) {
      Object.entries(args.policies).map(([policy, arn]) => (
        new aws.iam.RolePolicyAttachment(`${name}-${policy}-attachment`, {
          role,
          policyArn: arn,
        }, { parent: this })
      ))
    }

    this.role = role

    this.registerOutputs({
      role: this.role,
    })
  }
}
