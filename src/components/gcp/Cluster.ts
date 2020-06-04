import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'
import * as random from '@pulumi/random'
import * as k8s from '@pulumi/kubernetes'

import { ServiceAccount } from '.'

import { generateKubeConfig } from './helpers'

const nodeDefaultScopes = [
  'https://www.googleapis.com/auth/compute',
  'https://www.googleapis.com/auth/devstorage.read_only',
  'https://www.googleapis.com/auth/logging.write',
  'https://www.googleapis.com/auth/monitoring',
  'https://www.googleapis.com/auth/servicecontrol',
  'https://www.googleapis.com/auth/trace.append',
]

export interface NodePool {
  name: string
  nodeCount?: number
  maxNodeCount?: number
  minNodeCount?: number
  nodeType: string
  diskSizeGb: number
  labels?: {}
  scopes?: Array<string>
  preemptible?: boolean
}

export interface ClusterArgs {
  labels: { [name: string]: string }
  region: string
  clusterAdmin: ServiceAccount
  masterAuth: {
    username: string
    password: string
  }
  nodePools: Array<NodePool>
  masterVersion?: string
  nodeVersion?: string
}

export class Cluster extends pulumi.ComponentResource {
  public readonly kubeconfig: pulumi.Output<string>

  public readonly k8sProvider: k8s.Provider

  public readonly nodePools: Array<gcp.container.NodePool>

  public readonly clusterAdmin: ServiceAccount

  public readonly network: gcp.compute.Network

  public readonly subnet: gcp.compute.Subnetwork

  public readonly cluster: gcp.container.Cluster

  constructor (
    name: string,
    args: ClusterArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super(`${pulumi.getProject()}:Cluster`, name, {}, opts)

    this.clusterAdmin = args.clusterAdmin

    this.network = new gcp.compute.Network(
      `${name}-network`,
      {
        // project: gcp.config.project,
        autoCreateSubnetworks: false,
      },
      { parent: this },
    )

    this.subnet = new gcp.compute.Subnetwork(
      `${name}-subnetwork`,
      {
        // project: gcp.config.project,
        // region: gcp.config.region,
        ipCidrRange: '10.0.0.0/24',
        network: this.network.name,
        secondaryIpRanges: [
          { rangeName: 'pods', ipCidrRange: '10.1.0.0/16' },
        ],
      },
      { parent: this },
    )

    this.cluster = new gcp.container.Cluster(
      name,
      {
        name,
        nodeVersion: args.masterVersion || 'latest',
        minMasterVersion: args.masterVersion || 'latest',
        network: this.network.name,
        subnetwork: this.subnet.name,
        masterAuth: args.masterAuth,
        initialNodeCount: 1,
        nodeConfig: {
          labels: {
            region: args.region,
            role: 'system',
          },
          machineType: 'g1-small',
          diskSizeGb: 10,
          preemptible: true,
          oauthScopes: [
            ...nodeDefaultScopes,
          ],
        },
      },
      { parent: this },
    )

    this.nodePools = args.nodePools.map((pool: NodePool) => {
      const {
        nodeCount = 1,
        maxNodeCount,
        minNodeCount = 1,
        nodeType,
        diskSizeGb,
        labels,
        scopes = [],
        preemptible = false,
      } = pool
      const poolName = `${name}-pool-${pool.name}`
      const poolId = new random.RandomString(
        `${poolName}-id`,
        {
          length: 6,
          special: false,
          upper: false,
          keepers: {
            nodeCount,
            minNodeCount,
            maxNodeCount,
            nodeType,
            diskSizeGb,
          },
        },
        { parent: this },
      )

      return new gcp.container.NodePool(
        `${name}-pool-${pool.name}`,
        {
          cluster: this.cluster.name,
          name: poolId.result.apply(id => `${pool.name}-${id}`),
          nodeCount,
          ...(maxNodeCount && {
            autoscaling: {
              maxNodeCount,
              minNodeCount,
            },
          }),
          nodeConfig: {
            labels,
            diskSizeGb,
            preemptible,
            machineType: nodeType,
            oauthScopes: [
              ...nodeDefaultScopes,
              ...scopes,
            ],
          },
          version: args.nodeVersion || undefined,
        },
        { parent: this },
      )
    })

    // Generate the cluster kubeconfig
    this.kubeconfig = pulumi
      .all([
        this.cluster.name,
        this.cluster.endpoint,
        this.cluster.masterAuth,
      ])
      .apply(([cluster, endpoint, auth]) => {
        const context = `${gcp.config.project}_${gcp.config.zone}_${cluster}`
        return generateKubeConfig(context, auth.clusterCaCertificate, endpoint)
      })

    this.k8sProvider = new k8s.Provider(
      `${name}-k8s-provider`,
      { kubeconfig: this.kubeconfig },
      { parent: this },
    )

    const $roleBinding = new k8s.rbac.v1.ClusterRoleBinding(
      `${name}-k8s-binding`,
      {
        metadata: {
          name: `${name}-k8s-binding`,
        },
        roleRef: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'ClusterRole',
          name: 'cluster-admin',
        },
        subjects: [
          {
            apiGroup: 'rbac.authorization.k8s.io',
            kind: 'User',
            name: this.clusterAdmin.account.email,
          },
        ],
      },
      {
        dependsOn: [
          this.cluster,
          ...this.nodePools,
        ],
        parent: this,
        provider: this.k8sProvider,
      },
    )

    this.registerOutputs({
      cluster: this.cluster,
      clusterAdmin: this.clusterAdmin,
      kubeconfig: this.kubeconfig,
      k8sProvider: this.k8sProvider,
      nodePools: this.nodePools,
    })
  }
}
