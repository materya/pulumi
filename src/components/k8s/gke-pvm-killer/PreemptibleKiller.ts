import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { ServiceAccount } from '../../gcp'

// import { repository, version } from './config'

export interface PreemptibleKillerArgs {
  repository?: pulumi.Input<string>
  version?: pulumi.Input<string>
}

const chartName = 'gke-pvm-killer'

export class PreemptibleKiller extends pulumi.ComponentResource {
  constructor (
    name: string,
    args: PreemptibleKillerArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:PreemptibleKiller', name, {}, opts)

    // const namespace = new k8s.core.v1.Namespace(
    //   `${name}-ns`,
    //   {
    //     metadata: {
    //       name: chartName,
    //     },
    //   },
    //   { parent: this },
    // )

    const serviceAccount = new ServiceAccount(
      `${name}-sa`,
      {
        accountId: `${name}-sa`,
        displayName: `${name} service account`,
        permissions: [
          'compute.instances.delete',
        ],
      },
      { parent: this },
    )
    const $saKey = serviceAccount.key.privateKey.apply(
      (key: string) => Buffer.from(key, 'base64').toString(),
    )

    const $chart = new k8s.helm.v2.Chart(
      name,
      {
        chart: chartName,
        fetchOpts: {
          repo: 'https://charts.rimusz.net',
        },
        // namespace: chartName,
        values: {
          googleServiceAccount: serviceAccount.key.privateKey,
        },
      },
      {
        // dependsOn: [namespace],
        parent: this,
      },
    )
  }
}
