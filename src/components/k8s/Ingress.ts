import * as pulumi from '@pulumi/pulumi'
import * as k8s from '@pulumi/kubernetes'
import { CertManager } from './cert-manager'

export interface IngressHost {
  hostname: pulumi.Input<string>
  serviceName: pulumi.Input<string>
  port: pulumi.Input<number>
  isDefault?: boolean
}

export interface IngressArgs {
  certificatesEmail: pulumi.Input<string>
  project: pulumi.Input<string>
  domain: pulumi.Input<string>
  hosts: Array<IngressHost>
}

interface RuleProps {
  host: pulumi.Input<string>
  serviceName: pulumi.Input<string>
  port: pulumi.Input<number>
}
const makeRule = ({ host, serviceName, port }: RuleProps): object => ({
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

    const $certManager = new CertManager(
      `${name}-certmanager`,
      {
        project: args.project,
        email: args.certificatesEmail,
      },
      { parent: this },
    )

    const $ingress = new k8s.extensions.v1beta1.Ingress(
      name,
      {
        metadata: {
          name,
          annotations: {
            'dns.alpha.kubernetes.io/external': 'true',
            'kubernetes.io/tls-acme': 'true',
          },
        },
        spec: {
          tls: args.hosts.map(({ hostname, isDefault = false }) => ({
            hosts: [
              ...(isDefault ? [args.domain] : []),
              `${hostname}.${args.domain}`,
            ],
            secretName: `${name}-${hostname}-tls-secret`,
          })),
          rules: args.hosts.reduce(
            (acc: Array<{}>, host): Array<{}> => {
              const { hostname, port, serviceName, isDefault } = host
              return [
                ...acc,
                ...(isDefault ? [makeRule({ port,
                  serviceName,
                  host: args.domain })] : []),
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
      },
      { parent: this },
    )
  }
}
