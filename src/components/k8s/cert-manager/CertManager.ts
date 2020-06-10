import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { ClusterIssuer } from '../../../vendors/cert-manager'

import * as config from './config'

export interface CertManagerArgs {
  email: pulumi.Input<string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  solvers: pulumi.Input<Array<any>>
  staging?: pulumi.Input<boolean>
  repository?: pulumi.Input<string>
  version?: pulumi.Input<string>
}

export class CertManager extends pulumi.ComponentResource {
  public readonly chart: k8s.helm.v2.Chart

  public readonly issuer: ClusterIssuer

  public readonly service: pulumi.Output<k8s.core.v1.Service>

  public readonly webhookService: pulumi.Output<k8s.core.v1.Service>

  constructor (
    name: string,
    args: CertManagerArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:CertManager', name, {}, opts)

    const version = args.version || config.version
    const staging = args.staging || config.staging
    const chartName = 'cert-manager'

    const namespace = new k8s.core.v1.Namespace(chartName, {
      metadata: {
        name: chartName,
      },
    }, { parent: this })

    this.chart = new k8s.helm.v2.Chart(name, {
      chart: chartName,
      version,
      fetchOpts: {
        repo: 'https://charts.jetstack.io',
      },
      namespace: namespace.metadata.apply(m => m.name),
      values: {
        ingressShim: {
          defaultIssuerName: `${name}-issuer`,
          defaultIssuerKind: 'ClusterIssuer',
        },
        installCRDs: true,
      },
    }, { parent: this })

    this.webhookService = this.chart.getResource(
      'v1/Service',
      `${name}-cert-manager-webhook`,
    )

    const webhookDeployment = this.chart.getResource(
      'apps/v1/Deployment',
      `${name}-cert-manager-webhook`,
    )

    this.service = this.chart.getResource(
      'v1/Service',
      `${name}-cert-manager`,
    )

    this.issuer = new ClusterIssuer(`${name}-issuer`, {
      metadata: {
        name: `${name}-issuer`,
      },
      spec: {
        acme: {
          server: ((args.staging || staging)
            ? 'https://acme-staging-v02.api.letsencrypt.org/directory'
            : 'https://acme-v02.api.letsencrypt.org/directory'
          ),
          email: args.email,
          privateKeySecretRef: {
            name: `${name}-issuer-secret`,
          },
          solvers: args.solvers,
        },
      },
    }, {
      parent: this,
      dependsOn: [
        this.chart,
        this.service,
        this.webhookService,
        webhookDeployment,
      ],
    })

    this.registerOutputs({
      chart: this.chart,
      service: this.service,
      webhookService: this.webhookService,
    })
  }
}
