import * as pulumi from '@pulumi/pulumi'
import { meta, core } from '@pulumi/kubernetes/types/input'
export declare namespace certmanager {
  namespace v1alpha2 {
    /**
     * ClusterIssuers are a resource type similar to Issuers.
     * They are specified in exactly the same way, but they do not belong
     * to a single namespace and can be referenced by Certificate resources
     * from multiple different namespaces.
     * They are particularly useful when you want to provide the ability to
     * obtain certificates from a central authority (e.g. Letsencrypt,
     * or your internal CA) and you run single-tenant clusters.
     *
     * More info:
     * https://cert-manager.readthedocs.io/en/latest/reference/clusterissuers.html
     */
    interface ClusterIssuer {
      /**
       * APIVersion defines the versioned schema of this representation of an
       * object. Servers should convert recognized schemas to the latest
       * internal value, and may reject unrecognized values.
       *
       * More info:
       * https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
       */
      apiVersion?: pulumi.Input<string>
      /**
       * Kind is a string value representing the REST resource this object
       * represents. Servers may infer this from the endpoint the client
       * submits requests to. Cannot be updated. In CamelCase.
       *
       * More info:
       * https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
       */
      kind?: pulumi.Input<string>
      /**
       * Standard object's metadata. More info:
       * https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata
       */
      metadata?: pulumi.Input<meta.v1.ObjectMeta>
      /**
       * Spec defines the behavior of a service.
       * https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status
       */
      spec?: pulumi.Input<ServiceSpec>
      /**
       * Most recently observed status of the service.
       * Populated by the system. Read-only. More info:
       * https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status
       */
      status?: pulumi.Input<core.v1.ServiceStatus>
    }

    /**
     * Issuers represent a certificate authority from which signed
     * x509 certificates can be obtained, such as Let’s Encrypt.
     * You will need at least one Issuer or ClusterIssuer in order
     * to begin issuing certificates within your cluster.
     *
     * More info:
     * https://cert-manager.readthedocs.io/en/latest/reference/issuers.html
     */
    interface Issuer {
      /**
       * APIVersion defines the versioned schema of this representation of an
       * object. Servers should convert recognized schemas to the latest
       * internal value, and may reject unrecognized values. More info:
       * https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
       */
      apiVersion?: pulumi.Input<string>
      /**
       * Kind is a string value representing the REST resource this object
       * represents. Servers may infer this from the endpoint the client
       * submits requests to. Cannot be updated. In CamelCase. More info:
       * https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
       */
      kind?: pulumi.Input<string>
      /**
       * Standard object's metadata. More info:
       * https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata
       */
      metadata?: pulumi.Input<meta.v1.ObjectMeta>
      /**
       * Spec defines the behavior of a service.
       * https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status
       */
      spec?: pulumi.Input<ServiceSpec>
      /**
       * Most recently observed status of the service.
       * Populated by the system. Read-only. More info:
       * https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status
       */
      status?: pulumi.Input<core.v1.ServiceStatus>
    }

    interface ServiceSpec extends core.v1.ServiceSpec {
      // TODO: improve acme field definition
      acme?: any,
    }
  }
}
