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
  public readonly issuer: ClusterIssuer

  constructor (
    name: string,
    args: CertManagerArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:CertManager', name, {}, opts)

    const version = args.version || config.version
    const staging = args.staging || config.staging
    const chart = 'cert-manager'

    const namespace = new k8s.core.v1.Namespace(chart, {
      metadata: {
        name: chart,
      },
    }, { parent: this })

    const certManager = new k8s.helm.v2.Chart(name, {
      chart,
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
    }, { parent: this, dependsOn: certManager })
  }
}
