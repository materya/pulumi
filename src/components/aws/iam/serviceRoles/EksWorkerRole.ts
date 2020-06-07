import { iam } from '@pulumi/aws'
import { ComponentResourceOptions } from '@pulumi/pulumi'

import { ServiceRole } from '../ServiceRole'

const EKSWorkerRole = (
  name: string,
  opts?: ComponentResourceOptions,
): iam.Role => {
  const serviceRole = new ServiceRole(name, {
    service: 'ec2.amazonaws.com',
    policies: {
      eksWorker: 'arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy',
      eksCni: 'arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy',
      ecrRO: 'arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly',
    },
  }, opts)

  return serviceRole.role
}

export default EKSWorkerRole
