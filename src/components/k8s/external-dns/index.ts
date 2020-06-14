import * as aws from '@pulumi/aws'
import * as gcp from '@pulumi/gcp'
import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'

import type { CloudProvider } from '@materya/pulumi'

import { iam } from '../../aws'

export type ZonePolicy = 'sync' | 'upsert-only'

export interface ExternalDnsArgs {
  domain: string
  labels: Record<string, string>
  namespace?: string
  nodeSelector?: Record<string, string>
  provider: CloudProvider
  providerArgs?: {
    aws?: {
      hostedZoneId?: string
      oidcIssuer: string
      serviceRole: aws.iam.Role
    }
    // google?: {}
  }
  serviceAccountName?: string
  zonePolicy: ZonePolicy
}

export class ExternalDNS extends pulumi.ComponentResource {
  constructor (
    name: string,
    args: ExternalDnsArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:ExternalDNS', name, {}, opts)

    const namespaceName = args.namespace ?? 'external-dns'
    const serviceAccountName = args.serviceAccountName ?? `${name}-sa`

    const namespace = new k8s.core.v1.Namespace(`${name}-namespace`, {
      metadata: {
        name: namespaceName,
      },
    }, { parent: this })

    let awsAssumeRole: aws.iam.Role

    if (args.provider === 'aws') {
      if (!args.providerArgs?.aws) {
        throw new Error("with `provider` as 'aws', you must set the `providerArgs.aws` argument.")
      }

      const { hostedZoneId, serviceRole, oidcIssuer } = args.providerArgs.aws

      const irsa = new iam.IRSA(`${name}-role`, {
        namespace: namespaceName,
        oidcIssuer,
        policy: iam.policies.ZoneManagerPolicy(hostedZoneId),
        serviceAccountName,
        serviceRole,
      }, { parent: this })

      awsAssumeRole = irsa.role
    }

    const $chart = new k8s.helm.v2.Chart(name, {
      fetchOpts: {
        repo: 'https://charts.bitnami.com/bitnami',
      },
      version: '2.22.1',
      chart: 'external-dns',
      namespace: namespaceName,
      values: {
        provider: args.provider,
        ...(args.provider === 'aws' && {
          aws: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            assumeRoleArn: awsAssumeRole!.arn,
            region: aws.config.region,
          },
        }),
        ...(args.provider === 'google' && {
          google: {
            project: gcp.config.project,
          },
        }),
        policy: args.zonePolicy,
        domainFilters: [
          args.domain,
        ],
        nodeSelector: args.nodeSelector,
        rbac: {
          serviceAccountName,
          ...(args.provider === 'google' && { create: true }),
          apiVersion: 'v1',
        },
        txtOwnerId: name,
      },
      transformations: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj: any): void => {
          if (obj.kind === 'Service') {
            // eslint-disable-next-line no-param-reassign
            obj.metadata.labels = {
              ...obj.metadata.labels,
              ...args.labels,
            }
          }

          if (obj.kind === 'Deployment') {
            // eslint-disable-next-line no-param-reassign
            obj.spec.template.metadata.labels = {
              ...obj.spec.template.metadata.labels,
              ...args.labels,
            }
          }
        },
      ],
    }, { parent: this, dependsOn: [namespace] })

    this.registerOutputs({})
  }
}
