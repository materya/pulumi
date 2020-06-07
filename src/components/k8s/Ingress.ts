import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'
import { CertManager, CertManagerArgs } from './cert-manager'

export interface IngressHost {
  hostname: pulumi.Input<string>
  serviceName: pulumi.Input<string>
  port?: pulumi.Input<number>
  isRoot?: boolean
}

export interface IngressArgs {
  customClass?: pulumi.Input<string>
  domain: pulumi.Input<string>
  hosts: Array<IngressHost>
  tls: {
    enabled: boolean
    options?: CertManagerArgs
  }
}

interface RuleProps {
  host: pulumi.Input<string>
  serviceName: pulumi.Input<string>
  port: pulumi.Input<number>
}

export type IngressRule = {
  host: pulumi.Input<string>
  http: {
    paths: Array<{
      backend: {
        serviceName: pulumi.Input<string>
        servicePort: pulumi.Input<number>
      }
    }>
  }
}
const makeRule = ({ host, serviceName, port }: RuleProps): IngressRule => ({
  host,
  http: {
    paths: [
      {
        backend: {
          serviceName,
          servicePort: port,
        },
      },
    ],
  },
})

export class Ingress extends pulumi.ComponentResource {
  constructor (
    name: string,
    args: IngressArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:Ingress', name, {}, opts)

    if (args.tls.enabled) {
      if (!args.tls.options) {
        throw new Error('If `tls` is enabled, provide a `CertManagerArgs`  options object.')
      }

      const $certManager = new CertManager(
        `${name}-certmanager`,
        args.tls.options,
        { parent: this },
      )
    }

    const $ingress = new k8s.extensions.v1beta1.Ingress(name, {
      metadata: {
        name,
        annotations: {
          'dns.alpha.kubernetes.io/external': 'true', // external-dns
          'kubernetes.io/tls-acme': 'true', // cert-manager
          ...(args.customClass && {
            'kubernetes.io/ingress.class': args.customClass,
          }),
        },
      },
      spec: {
        tls: args.hosts.map(({ hostname, isRoot = false }) => ({
          hosts: [
            ...(isRoot ? [args.domain] : []),
            `${hostname}.${args.domain}`,
          ],
          secretName: `${name}-${hostname}-tls-secret`,
        })),
        rules: args.hosts.reduce(
          (acc: Array<IngressRule>, host): Array<IngressRule> => {
            const { hostname, port = 80, serviceName, isRoot } = host
            return [
              ...acc,
              ...(isRoot
                ? [makeRule({ port, serviceName, host: args.domain })]
                : []
              ),
              makeRule({
                port,
                serviceName,
                host: `${hostname}.${args.domain}`,
              }),
            ]
          },
          [],
        ),
      },
    }, { parent: this })
  }
}
