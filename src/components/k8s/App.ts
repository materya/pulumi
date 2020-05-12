// import * as gcp from '@pulumi/gcp'
// import * as k8s from '@pulumi/kubernetes'
// import * as pulumi from '@pulumi/pulumi'

// // const labels = { tier: 'backend', app: 'mqtt-client' }

// // const config: pulumi.Config = new pulumi.Config('mqtt-client')

// // const envArgs = {
// //   debug: config.get('debug') || '',
// // }

// export interface AppArgs {
//   name: string,
//   enableHA: boolean,

// }

// export class App extends pulumi.ComponentResource {
//   public service: k8s.core.v1.Service

//   constructor(
//     name: string,
//     args: AppArgs,
//     opts: pulumi.ComponentResourceOptions,
//   ) {
//     super('materya:App', name, {}, opts)

//     const env = [
//       { name: 'DEBUG', value: envArgs.debug },
//       { name: 'NODE_ENV', value: 'production' },
//       { name: 'PORT', value: '1883' },
//       { name: 'DATABASE_URL', value: args.dbURL },
//       {
//         name: 'MQTT_BROKER_URI',
//         value: args.mqttService.metadata.apply(m => m.name),
//       },
//       { name: 'MQTT_ROOT_TOPIC', value: '#' },
//     ]

//     this.service = new k8s.core.v1.Service(
//       name,
//       {
//         metadata: {
//           name,
//           labels,
//           // annotations: {
//           //   'dns.alpha.kubernetes.io/external': `api.${domain}`,
//           //   'external-dns.alpha.kubernetes.io/hostname': `api.${domain}`,
//           // },
//         },
//         spec: {
//           // type: lbEnabled ? 'LoadBalancer' : 'ClusterIP',
//           type: 'NodePort',
//           ports: [{ port: 80 }],
//           selector: labels,
//         },
//       },
//       { parent: this },
//     )

//     const image = pulumi.all([args.registry]).apply(([registry]) => (
//       `${registry}/${gcp.config.project}/context-mqtt-client:${args.tag}`
//     ))

//     const deploy = new k8s.apps.v1.Deployment(
//       name,
//       {
//         metadata: {
//           name,
//         },
//         spec: {
//           selector: { matchLabels: labels },
//           replicas: 1,
//           // replicas: 3
//           // strategy:
//           //   rollingUpdate:
//           //     maxSurge: 1
//           //     maxUnavailable: 1
//           //   type: RollingUpdate
//           template: {
//             metadata: { labels },
//             spec: {
//               containers: [{
//                 name,
//                 image,
//                 imagePullPolicy: 'Always',
//                 resources: {
//                   requests: {
//                     cpu: "100m",
//                     memory: "200Mi",
//                   },
//                 },
//                 env,
//                 ports: [{ containerPort: 80 }],
//                 readinessProbe: {
//                   httpGet: {
//                     path: '/status',
//                     port: 80,
//                     initialDelaySeconds: 10,
//                     timeoutSeconds: 5,
//                   },
//                 },
//               }],
//             },
//           },
//         },
//       },
//       { parent: this },
//     )
//   }
// }
