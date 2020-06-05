import * as pulumi from '@pulumi/pulumi'

const config: pulumi.Config = new pulumi.Config('certmanager')

export const staging: boolean = config.getBoolean('staging') || false
export const repository: string = config.get('respository') || 'stable'
export const version = '0.15.1'
