import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'
import * as random from '@pulumi/random'

import { ServiceAccount } from './ServiceAccount'

export interface BucketArgs {
  bucketArgs?: gcp.storage.BucketArgs
  bucketName?: pulumi.Input<string>
  isPublic?: boolean
}

export class Bucket extends pulumi.ComponentResource {
  public readonly admin: ServiceAccount

  public readonly bucket: gcp.storage.Bucket

  public readonly isPublic: boolean

  public readonly name: string

  constructor (
    name: string,
    args: BucketArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('materya:gcp:Bucket', name, {}, opts)

    this.name = name
    this.isPublic = args.isPublic || false

    this.bucket = new gcp.storage.Bucket(`${name}-bucket`, {
      name: args.bucketName || name,
      ...args.bucketArgs,
    }, { parent: this })

    const bucketAdminId = new random.RandomString(`${name}-admin-id`, {
      length: 6,
      upper: false,
      special: false,
    }, { parent: this })

    this.admin = new ServiceAccount(`${name}-manager`, {
      accountId: bucketAdminId.result.apply(id => `bucket-admin-${id}`),
      displayName: `${name} bucket admin`,
    }, { parent: this })

    const $adminRoleBinding = new gcp.storage.BucketIAMBinding(
      `${name}-admin-binding`,
      {
        bucket: this.bucket.name,
        role: 'roles/storage.objectAdmin',
        members: [
          this.admin.account.email.apply(email => `serviceAccount:${email}`),
        ],
      },
      { parent: this },
    )

    if (args.isPublic) {
      const $publicRoleBinding = new gcp.storage.BucketIAMBinding(
        `${name}-public-binding`,
        {
          bucket: this.bucket.name,
          role: 'roles/storage.legacyObjectReader',
          members: [
            'allUsers',
          ],
        },
        { parent: this },
      )
    }

    this.registerOutputs({
      bucket: this.bucket,
      admin: this.admin,
    })
  }
}
