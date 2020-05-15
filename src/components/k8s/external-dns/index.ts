import * as aws from '@pulumi/aws'
import * as gcp from '@pulumi/gcp'
import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'

import { createRole } from './aws'

export type ZonePolicy = 'sync' | 'upsert-only'
export type DnsProvider = 'aws' | 'google' // | 'azure'

export interface ExternalDnsArgs {
  domain: string
  labels: Record<string, string>
  // namespace?: string
  nodeSelector?: {}
  provider: DnsProvider
  providerArgs?: {
    aws?: {
      hostedZoneId?: string
      oidcIssuer: string
    }
    google?: {}
  }
  serviceAccountName?: string
  serviceRole: aws.iam.Role
  zonePolicy: ZonePolicy
}

export class ExternalDNS extends pulumi.ComponentResource {
  constructor (
    name: string,
    args: ExternalDnsArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:ExternalDNS', name, {}, opts)

    // const namespace = args.namespace ?? 'default'
    const namespaceName = 'external-dns'
    const serviceAccountName = args.serviceAccountName ?? `${name}-sa`

    const namespace = new k8s.core.v1.Namespace(`${name}-namespace`, {
      metadata: {
        name: namespaceName,
      },
    }, { parent: this })

    let awsAssumeRole: pulumi.Output<aws.iam.Role>

    if (args.provider === 'aws') {
      awsAssumeRole = createRole(
        this,
        `${name}-role`,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        args.providerArgs!.aws!.oidcIssuer,
        serviceAccountName,
        args.serviceRole,
        args.providerArgs?.aws?.hostedZoneId,
        namespaceName,
      )
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
