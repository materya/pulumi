import * as carbon from '@materya/carbon'
import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { ServiceAccount } from '../../gcp'

export interface PreemptibleKillerArgs {
  chartValuesOverride?: pulumi.Inputs
  labels?: Record<string, string>
  namespace?: string
  // nodeSelector?: pulumi.Input<Record<string, string>>
  repository?: pulumi.Input<string>
  version?: pulumi.Input<string>
}

export class PreemptibleKiller extends pulumi.ComponentResource {
  constructor (
    name: string,
    args: PreemptibleKillerArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:k8s:PreemptibleKiller', name, {}, opts)

    const chartContext = {
      name: 'gke-pvm-killer',
      repository: 'https://charts.rimusz.net',
      version: '0.1.3',
    }

    const {
      chartValuesOverride,
      // nodeSelector,
      namespace = 'default',
    } = args

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

    if (namespace !== 'default') {
      const _namespace = new k8s.core.v1.Namespace(`namespace-${namespace}`, {
        metadata: {
          name: namespace,
        },
      }, { parent: this })
    }

    const chartValues = {
      googleServiceAccount: serviceAccount.key.privateKey,
    }

    const _chart = new k8s.helm.v2.Chart(name, {
      namespace,
      chart: chartContext.name,
      fetchOpts: { repo: chartContext.repository },
      values: chartValuesOverride
        ? carbon.tools.merge(chartValues, chartValuesOverride)
        : chartValues,
      version: chartContext.version,
    }, { parent: this })
  }
}
