import * as pulumi from '@pulumi/pulumi'
import { meta } from '@pulumi/kubernetes/types/output'
import * as inputApi from './types/input'

// eslint-disable-next-line import/prefer-default-export
export class Issuer extends pulumi.CustomResource {
  /**
   * Get the state of an existing `Issuer` resource,
   * as identified by `id`.
   * Typically this ID is of the form <namespace>/<name> ;
   * if <namespace> is omitted, then (per Kubernetes convention)
   * the ID becomes default/<name>.
   *
   * Pulumi will keep track of this resource using `name` as the Pulumi ID.
   *
   * @param {string} name _Unique_ name used to register this resource with Pulumi.
   * @param {pulumi.Input<pulumi.ID>} id An ID for the Kubernetes resource to retreive. Takes the form <namespace>/<name> or <name>.
   *
   * @returns {Issuer} a ClusterIssuer instance
   */
  public static get (
    name: string,
    id: pulumi.Input<pulumi.ID>,
  ): Issuer {
    return new Issuer(name, undefined, { id })
  }

  /**
   * APIVersion defines the versioned schema of this representation of
   * an object. Servers should convert recognized schemas to the latest
   * internal value, and may reject unrecognized values.
   *
   * More info:
   * https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
   */
  public readonly apiVersion!: pulumi.Output<string>

  /**
   * Kind is a string value representing the REST resource this object
   * represents. Servers may infer this from the endpoint the client
   * submits requests to. Cannot be updated. In CamelCase.
   *
   * More info:
   * https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
   */
  public readonly kind!: pulumi.Output<string>

  /**
   * Standard object metadata.
   *
   * More info:
   * https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata.
   */
  public readonly metadata!: pulumi.Output<meta.v1.ObjectMeta>

  private readonly inputs: inputApi.certmanager.v1alpha2.Issuer

  /**
   * Create a certmanager.v1alpha2.Issuer resource with
   * the given unique name, arguments, and options.
   *
   * @param {string} name The _unique_ name of the resource.
   * @param {inputApi.certmanager.v1alpha2.ClusterIssuer} [args] The arguments to use to populate this resource's properties.
   * @param {pulumi.CustomResourceOptions} [opts] A bag of options that control this resource's behavior.
   */
  constructor (
    name: string,
    args?: inputApi.certmanager.v1alpha2.Issuer,
    opts?: pulumi.CustomResourceOptions,
  ) {
    const inputs = {
      apiVersion: 'cert-manager.io/v1alpha2',
      kind: 'Issuer',
      metadata: args?.metadata ?? undefined,
      spec: args?.spec ?? undefined,
      status: args?.status ?? undefined,
    }

    super(
      `kubernetes:${inputs.apiVersion}:${inputs.kind}`,
      name,
      inputs,
      opts,
    )

    this.inputs = inputs
  }

  public getInputs (): inputApi.certmanager.v1alpha2.Issuer {
    return this.inputs
  }
}
