import * as pulumi from '@pulumi/pulumi'

const config: pulumi.Config = new pulumi.Config('preemptible-killer')

export const repository: string = config.get('respository') || 'stable'
export const version: string = config.get('version') || 'latest'
