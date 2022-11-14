import * as gcp from '@pulumi/gcp'
import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'

export interface ServiceAccountArgs {
  accountId: pulumi.Input<string>
  displayName?: pulumi.Input<string>
  roles?: Array<pulumi.Input<string>>
  permissions?: Array<pulumi.Input<string>>
}

export class ServiceAccount extends pulumi.ComponentResource {
  public readonly gcpProvider: gcp.Provider

  public readonly account: gcp.serviceaccount.Account

  public readonly key: gcp.serviceaccount.Key

  public secret?: k8s.core.v1.Secret

  public readonly name: string

  constructor (
    name: string,
    args: ServiceAccountArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:gcp:ServiceAccount', name, {}, opts)

    this.name = name

    let roles: Array<pulumi.Input<string>> = []

    this.account = new gcp.serviceaccount.Account(this.name, {
      accountId: args.accountId,
      displayName: args.displayName || undefined,
    }, { parent: this })

    if (args && args.roles) roles = [...roles, ...args.roles]

    if (args && args.permissions) {
      const roleId = `custom.${name.replace(/-/g, '_')}`
      const _customRole = new gcp.projects.IAMCustomRole(`${this.name}-role`, {
        roleId,
        title: `${args.displayName || this.name} Custom Role`,
        project: gcp.config.project,
        permissions: args.permissions,
      }, { parent: this })
      roles = [...roles, `projects/${gcp.config.project}/roles/${roleId}`]
    }

    const _rolesBinding = roles.map(role => (
      new gcp.projects.IAMBinding(`${this.name}-binding-${role}`, {
        role,
        members: [
          this.account.email.apply((email: string) => (
            `serviceAccount:${email}`
          )),
        ],
      }, { parent: this })
    ))

    this.key = new gcp.serviceaccount.Key(`${this.name}-key`, {
      serviceAccountId: this.account.name,
    }, { parent: this })

    const jsonKey = this.key.privateKey.apply((key: string) => (
      Buffer.from(key, 'base64').toString()
    ))

    this.gcpProvider = new gcp.Provider(`${this.name}-gcp-provider`, {
      credentials: jsonKey,
      project: gcp.config.project,
      region: gcp.config.region,
      zone: gcp.config.zone,
    }, { parent: this })
  }

  public createK8sAccountKeySecret (args: { provider: k8s.Provider }): void {
    const name = `${this.name}-secret`
    this.secret = new k8s.core.v1.Secret(name, {
      data: {
        privateKey: this.key.privateKey,
      },
      metadata: {
        name: this.name,
        annotations: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'kubernetes.io/service-account.name': this.name,
        },
      },
      type: 'Opaque',
    }, { parent: this, provider: args.provider })
  }
}
