# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.8.0-rc.0](https://github.com/materya/pulumi/compare/v4.7.1...v4.8.0-rc.0) (2022-11-03)


### Features

* allow finer cloudfront TTL configuration ([5043e47](https://github.com/materya/pulumi/commit/5043e47fd4f9193d26d924af515149f37e7a8dec))


### Bug Fixes

* allow using s3 regional domain name to prevent redirect issues ([87d7a13](https://github.com/materya/pulumi/commit/87d7a13da2391933b372b8d42dd79dba6e153647))

### [4.7.1](https://github.com/materya/pulumi/compare/v4.7.0...v4.7.1) (2022-08-01)

## [4.7.0](https://github.com/materya/pulumi/compare/v4.6.2...v4.7.0) (2022-06-02)


### Features

* all to pass version and tag to external and add random string in name ([ac981d5](https://github.com/materya/pulumi/commit/ac981d585112aca803e72166e9eec968129d5657))

### [4.6.2](https://github.com/materya/pulumi/compare/v4.6.1...v4.6.2) (2022-03-22)


### Bug Fixes

* exclude unsupported schema object_type in DefaultPrivileges ([f2b3c7f](https://github.com/materya/pulumi/commit/f2b3c7fb1d6c2966b00e6c2d43114b76e634deb1))

### [4.6.1](https://github.com/materya/pulumi/compare/v4.6.0...v4.6.1) (2022-02-08)

## [4.6.0](https://github.com/materya/pulumi/compare/v4.5.1...v4.6.0) (2022-02-08)


### Features

* allow to configure trustedKeyGroups when creating Cloudfront Distribution ([#649](https://github.com/materya/pulumi/issues/649)) ([66501ad](https://github.com/materya/pulumi/commit/66501ad31d6f926ce88ef18a5effb151b03804e6))

### [4.5.1](https://github.com/materya/pulumi/compare/v4.5.0...v4.5.1) (2021-11-19)

## [4.5.0](https://github.com/materya/pulumi/compare/v4.4.1...v4.5.0) (2021-11-19)


### Features

* add cloudfront arn and id in output  ([a110526](https://github.com/materya/pulumi/commit/a110526aaf3e49bfc1759951b65f94e416f0de02))

### [4.4.1](https://github.com/materya/pulumi/compare/v4.4.0...v4.4.1) (2021-09-14)

## [4.4.0](https://github.com/materya/pulumi/compare/v4.3.0...v4.4.0) (2021-09-13)


### Features

* **aws.Zone:** extends native zone args ([ebf0c1b](https://github.com/materya/pulumi/commit/ebf0c1be29b14e59fc59eecdb611f8741912aed9))

## [4.3.0](https://github.com/materya/pulumi/compare/v4.2.2...v4.3.0) (2021-09-13)


### Features

* **postgresql:** repmgrPassword persistent argument ([8bd2b0e](https://github.com/materya/pulumi/commit/8bd2b0efea4760e4dab0b1abde71d03de66d8dd5))
* **postgresql:** update schema grant management ([6e53b81](https://github.com/materya/pulumi/commit/6e53b81d170301e7d2fea37bd295abf70a6cca68))


### Bug Fixes

* **cloudfront:** weird TS compilation error ([cb8079b](https://github.com/materya/pulumi/commit/cb8079bc35ab95b865589f9700d3b97bf07c7cf7))
* upgrade dependencies ([0c3bbb3](https://github.com/materya/pulumi/commit/0c3bbb3d9b08c4224f146f47cdb94b6947a02196))

### [4.2.2](https://github.com/materya/pulumi/compare/v4.2.1...v4.2.2) (2021-03-02)


### Bug Fixes

* **deps:** upgrade modules versions ([1c83de8](https://github.com/materya/pulumi/commit/1c83de8488ed9330deb099cb1c1d59aaaaec35bf))
* package.json & package-lock.json to reduce vulnerabilities ([#441](https://github.com/materya/pulumi/issues/441)) ([bbad3a2](https://github.com/materya/pulumi/commit/bbad3a225160a8adee04d1dc9e6e68772d72c7f9))
* **postgresql:** typo ([b392b49](https://github.com/materya/pulumi/commit/b392b4904e30e5a992a45b1fbddfaf28cac3a191))

### [4.2.1](https://github.com/materya/pulumi/compare/v4.2.0...v4.2.1) (2021-01-20)


### Bug Fixes

* postgresql Privileges handling ([d043b31](https://github.com/materya/pulumi/commit/d043b3197947a589054ccf9f39464880583072de))

## [4.2.0](https://github.com/materya/pulumi/compare/v4.1.0...v4.2.0) (2021-01-20)


### Features

* reorganize postgresql components ([e8b247c](https://github.com/materya/pulumi/commit/e8b247c538cc91bb7f96845d4ce2cca1d979e113))

## [4.1.0](https://github.com/materya/pulumi/compare/v4.0.0...v4.1.0) (2021-01-20)


### Features

* **k8s/psql:** add standard privileges profiles ([a62a89b](https://github.com/materya/pulumi/commit/a62a89be23ec272f4ead01f680f8491aa0b1466a))

## [4.0.0](https://github.com/materya/pulumi/compare/v4.0.0-rc.8...v4.0.0) (2021-01-19)


### Bug Fixes

* small adjustments ([7757e5f](https://github.com/materya/pulumi/commit/7757e5f1c5ef0790be4b08cf2d378725051ea827))

## [4.0.0-rc.8](https://github.com/materya/pulumi/compare/v4.0.0-rc.7...v4.0.0-rc.8) (2021-01-19)


### Bug Fixes

* **k8s/postgresql:** grants creation issue ([0ef52d1](https://github.com/materya/pulumi/commit/0ef52d1cfa97e5c6287711050db1c893d345cc9e))

## [4.0.0-rc.7](https://github.com/materya/pulumi/compare/v4.0.0-rc.6...v4.0.0-rc.7) (2021-01-19)


### Bug Fixes

* **k8s/postgresql/user:** postgresql.Grant resource naming ([b5cd276](https://github.com/materya/pulumi/commit/b5cd276881c60652938887f909cdd64ff0981982))

## [4.0.0-rc.6](https://github.com/materya/pulumi/compare/v4.0.0-rc.5...v4.0.0-rc.6) (2021-01-19)


### Bug Fixes

* **k8s/postgresql/user:** add schema dependency to privs & grants ([6ecb611](https://github.com/materya/pulumi/commit/6ecb61175e680ea05871c029594cdbe5b89d3bee))

## [4.0.0-rc.5](https://github.com/materya/pulumi/compare/v4.0.0-rc.4...v4.0.0-rc.5) (2021-01-18)


### Bug Fixes

* **k8s/postgresql/user:** add schema dependency to privs & grants ([fcbd836](https://github.com/materya/pulumi/commit/fcbd8363f5f4a1ffb22c7a2ab69a310f2d486c39))

## [4.0.0-rc.4](https://github.com/materya/pulumi/compare/v4.0.0-rc.3...v4.0.0-rc.4) (2021-01-18)


### Bug Fixes

* **postgresql:** remove version restrictions ([4509b76](https://github.com/materya/pulumi/commit/4509b7672da825c20ba642de402cffb633371053))

## [4.0.0-rc.3](https://github.com/materya/pulumi/compare/v4.0.0-rc.2...v4.0.0-rc.3) (2021-01-17)


### Bug Fixes

* **postgresql:** wrong admin username handling ([9b74df7](https://github.com/materya/pulumi/commit/9b74df7d8db49cb12a6a50b14ddee26803760c52))

## [4.0.0-rc.2](https://github.com/materya/pulumi/compare/v4.0.0-rc.1...v4.0.0-rc.2) (2021-01-17)


### Features

* **postgresql:** add PostgresqlUser ([c510af9](https://github.com/materya/pulumi/commit/c510af978a621f029e436fd1fbb3ba61f80852ac))

## [4.0.0-rc.1](https://github.com/materya/pulumi/compare/v4.0.0-rc.0...v4.0.0-rc.1) (2021-01-17)


### Bug Fixes

* **postgresql:** default arguments handling ([87e7428](https://github.com/materya/pulumi/commit/87e7428b0f38e3859079fd9685c9077bb8ca54d0))

## [4.0.0-rc.0](https://github.com/materya/pulumi/compare/v4.0.0-beta.0...v4.0.0-rc.0) (2021-01-17)

## [4.0.0-beta.0](https://github.com/materya/pulumi/compare/v3.1.1...v4.0.0-beta.0) (2021-01-17)


### ⚠ BREAKING CHANGES

* **k8s/postgresql:** refactor of Postgresql module

### Features

* **k8s/postgresql:** refactor of Postgresql module ([653ac9a](https://github.com/materya/pulumi/commit/653ac9a6ad89f3b816b6313a09661cf530f29fb3))

### [3.1.1](https://github.com/materya/pulumi/compare/v3.1.0...v3.1.1) (2021-01-10)


### Bug Fixes

* **postgresql:** adjust chart overrides parameter ([aece8b3](https://github.com/materya/pulumi/commit/aece8b3bc9bb4b72809529c36e685ffaa5f2b74f))

## [3.1.0](https://github.com/materya/pulumi/compare/v3.0.1...v3.1.0) (2021-01-10)


### Features

* **postgresql:** add a cahrt override parameters ([445e547](https://github.com/materya/pulumi/commit/445e5470624e6e3bff6aed0b995bf7af8e03fada))

### [3.0.1](https://github.com/materya/pulumi/compare/v3.0.0...v3.0.1) (2020-12-15)


### Bug Fixes

* **postgresql:** wrong config getters ([eb6f7ed](https://github.com/materya/pulumi/commit/eb6f7edbc0fdcf49a4357cbad6eec13a570848e5))

## [3.0.0](https://github.com/materya/pulumi/compare/v2.7.0...v3.0.0) (2020-12-15)


### ⚠ BREAKING CHANGES

* **postgresql:** upgrade postgresql-ha chart to 6.2.3

### Features

* **postgresql:** add a `chartVersion` parameter for fine grained deployment ([94ca21e](https://github.com/materya/pulumi/commit/94ca21eb1cd73defab85cc791b5644e2ca4d5dff))
* **postgresql:** upgrade postgresql-ha chart to 6.2.3 ([78806bf](https://github.com/materya/pulumi/commit/78806bf6052e282615689f69fc4f2a12db1d6319))


### Bug Fixes

* **deps:** vulnerabilites ([af6ab8e](https://github.com/materya/pulumi/commit/af6ab8eed93a63c064e1e3e3d9ee41d8de7f369c))
* **gcp.ServiceAccount:** spec definitions ([655fa3b](https://github.com/materya/pulumi/commit/655fa3b99bcb0c3615a1f27d337f63e4fdd5cfef))

## [2.7.0](https://github.com/materya/pulumi/compare/v2.7.0-beta.0...v2.7.0) (2020-08-27)


### Features

* **aws:** Certificate with several aws auth possibilities ([443c336](https://github.com/materya/pulumi/commit/443c33603776e348bf3421284aab0ea8a63b33f8))
* **cert-manager:** provide an options override param ([9170c67](https://github.com/materya/pulumi/commit/9170c67241a060e072125a1cd68f2d0f9ed1474f))
* **psql:** extend psql user grants ([26ebcba](https://github.com/materya/pulumi/commit/26ebcba2c1a199761d8f728b8bd91be81cc679af))


### Bug Fixes

* **deps:** vulnerabilities & upgrade ([721df46](https://github.com/materya/pulumi/commit/721df4690a745f857997ede890622be17199ab0e))

## [2.7.0-beta.0](https://github.com/materya/pulumi/compare/v2.6.0...v2.7.0-beta.0) (2020-08-04)


### Features

* **k8s/postgresql:** add custom grants for users ([39683a3](https://github.com/materya/pulumi/commit/39683a3edc4bc3037a87d56643d455817f9f197c))

## [2.6.0](https://github.com/materya/pulumi/compare/v2.5.0...v2.6.0) (2020-08-04)


### Features

* **k8s/postgresql:** improve user creation ([fc414a0](https://github.com/materya/pulumi/commit/fc414a005c3354cb3eb195a36d69586c4ff19f5c))

## [2.6.0-beta.0](https://github.com/materya/pulumi/compare/v2.5.0...v2.6.0-beta.0) (2020-08-04)


### Features

* **k8s/postgresql:** improve user creation ([97337af](https://github.com/materya/pulumi/commit/97337af89c67e076374b38f6932f358f449dbfcd))

## [2.5.0](https://github.com/materya/pulumi/compare/v2.4.0...v2.5.0) (2020-08-03)


### Features

* **k8s/postgresql:** improve component ([bb1b717](https://github.com/materya/pulumi/commit/bb1b7173378ba72369fb2c28b431a86160304a3b))


### Bug Fixes

* **deps:** vulnerabilities ([416dbb1](https://github.com/materya/pulumi/commit/416dbb1535e088c0f516ba75875799706dca13ec))

## [2.5.0-beta.2](https://github.com/materya/pulumi/compare/v2.5.0-beta.1...v2.5.0-beta.2) (2020-08-03)

## [2.5.0-beta.1](https://github.com/materya/pulumi/compare/v2.5.0-beta.0...v2.5.0-beta.1) (2020-08-03)

## [2.5.0-beta.0](https://github.com/materya/pulumi/compare/v2.4.0...v2.5.0-beta.0) (2020-08-03)


### Features

* **k8s/postgresql:** improve component ([3227c88](https://github.com/materya/pulumi/commit/3227c88bdea6796ddbbf39b3a8b48d80a8a79351))


### Bug Fixes

* **deps:** vulnerabilities ([416dbb1](https://github.com/materya/pulumi/commit/416dbb1535e088c0f516ba75875799706dca13ec))

## [2.4.0](https://github.com/materya/pulumi/compare/v2.3.0...v2.4.0) (2020-07-13)


### Features

* **k8s.Ingress:** add custom annotations ([81e136f](https://github.com/materya/pulumi/commit/81e136fabdcf86cde06874868d0689b8d7b2f2c1))

## [2.3.0](https://github.com/materya/pulumi/compare/v2.2.1...v2.3.0) (2020-07-06)


### Features

* **external-dns:** ensure Input arguments ([b9a2aa6](https://github.com/materya/pulumi/commit/b9a2aa6e9fcb931fe8d35234de00b3179e2ad55e))
* **k8s.Postgresql:** use postgresql-ha chart ([f07080d](https://github.com/materya/pulumi/commit/f07080db489e3de1f268e3e38e2911ac8b976881))


### Bug Fixes

* **cert-manager:** fix dependencies ([ed8df27](https://github.com/materya/pulumi/commit/ed8df27a5a9fd6ad19df85876811a7d7c08d6d7d))
* **gcp:** Cluster nodes version ([e6a1c94](https://github.com/materya/pulumi/commit/e6a1c94959776ef86f42859f659a94b208427eff))
* **k8s.Ingress:** handling Input domain ([c1e5b33](https://github.com/materya/pulumi/commit/c1e5b33a8ebc1a98dd19d1199583bf122c7dd8ce))

### [2.2.1](https://github.com/materya/pulumi/compare/v2.2.0...v2.2.1) (2020-07-05)


### Bug Fixes

* **gcp:** Cluster labels typing ([b86469f](https://github.com/materya/pulumi/commit/b86469fa420fd702a52090dfb47c7755f5e49456))

## [2.2.0](https://github.com/materya/pulumi/compare/v2.0.2...v2.2.0) (2020-07-05)


### Features

* **gcp:** improve Bucket args ([6eed011](https://github.com/materya/pulumi/commit/6eed011d2131e211a9375837ce7a082e2795fd88))

## [2.1.0](https://github.com/materya/pulumi/compare/v2.0.2...v2.1.0) (2020-07-04)


### Features

* **gcp:** improve Bucket args ([6eed011](https://github.com/materya/pulumi/commit/6eed011d2131e211a9375837ce7a082e2795fd88))

### [2.0.2](https://github.com/materya/pulumi/compare/v2.0.1...v2.0.2) (2020-06-14)


### Bug Fixes

* **deps:** upgrade ([dfbf490](https://github.com/materya/pulumi/commit/dfbf490a00121c90cd4a46cfa6931a042278ad55))

### [2.0.1](https://github.com/materya/pulumi/compare/v2.0.0...v2.0.1) (2020-06-10)


### Bug Fixes

* **k8s/CertManager:** `ClusterIssuer` deploy dependencies ([3e307be](https://github.com/materya/pulumi/commit/3e307be22039c74dbf3da60b5a80051c80f387db))

## [2.0.0](https://github.com/materya/pulumi/compare/v1.6.0...v2.0.0) (2020-06-07)


### ⚠ BREAKING CHANGES

* aws iam components refactor

### Features

* aws iam components refactor ([7bd01c4](https://github.com/materya/pulumi/commit/7bd01c46c3f98d4cd1b78451c4c751eea8b8ce79))

## [1.6.0](https://github.com/materya/pulumi/compare/v1.5.0...v1.6.0) (2020-06-05)


### Features

* **k8s/cert-manager:** upgrade supported version to 0.15.1 ([03e81f5](https://github.com/materya/pulumi/commit/03e81f57f50b73fd9f07567b5ff84412469e428f))
* **k8s/Ingress:** make `IngressHost` `port` optional ([6e8f643](https://github.com/materya/pulumi/commit/6e8f643498cdb392b9ab4247992eaa684ecccd3a))

## [1.5.0](https://github.com/materya/pulumi/compare/v1.4.1...v1.5.0) (2020-06-05)


### Features

* **k8s/external-dns:** wrong global argument ([4bdf07e](https://github.com/materya/pulumi/commit/4bdf07ebcb9444415fe7a95618a93f38e87cfa55))

### [1.4.1](https://github.com/materya/pulumi/compare/v1.4.0...v1.4.1) (2020-06-04)


### Bug Fixes

* **gcp:** Cluster pools default nodeCounts values ([725a688](https://github.com/materya/pulumi/commit/725a6889630be7d95b0998e24b7ee2355e0e0223))

## [1.4.0](https://github.com/materya/pulumi/compare/v1.3.1...v1.4.0) (2020-06-04)


### Features

* **gcp:** add `Zone` component ([d1dc9cf](https://github.com/materya/pulumi/commit/d1dc9cfd9befc9e51cb9d6de46a002161d977c91))

### [1.3.1](https://github.com/materya/pulumi/compare/v1.3.0...v1.3.1) (2020-06-04)


### Bug Fixes

* dist was not rebuild before previous release ([f2fa0ee](https://github.com/materya/pulumi/commit/f2fa0ee05faa4bbd712c768dc933d716a9c2e8dd))

## [1.3.0](https://github.com/materya/pulumi/compare/v1.2.0...v1.3.0) (2020-06-04)


### Features

* expose gcp components ([ec6c4f3](https://github.com/materya/pulumi/commit/ec6c4f3cfa55f784bf47a405a0f1e6d39cff069e))


### Bug Fixes

* **deps:** upgrade ([b14c203](https://github.com/materya/pulumi/commit/b14c2034ccd093db75adaac09db8a09c40de019d))
* **deps:** upgrade ([41935ba](https://github.com/materya/pulumi/commit/41935ba5b6f37d0b22fcef32ff734cfc1ae45722))

## [1.2.0](https://github.com/materya/pulumi/compare/v1.1.0...v1.2.0) (2020-05-26)


### Features

* better zone & domains handling ([8ee830b](https://github.com/materya/pulumi/commit/8ee830bf92d05e62f2091d4ae30364f411b3468c))
* better zone & domains handling, added options ([5864ce9](https://github.com/materya/pulumi/commit/5864ce93fdb3d539f4f825236e2b9efdc2d4c2fa))


### Bug Fixes

* better external-dns chart provisioning ([9213dc6](https://github.com/materya/pulumi/commit/9213dc65d8d7ac236e712b52c648c7924c8360a2))

## [1.1.0](https://github.com/materya/pulumi/compare/v1.1.0-beta.0...v1.1.0) (2020-05-15)


### Features

* **k8s:** add `external-dns` chart provisioning ([04de608](https://github.com/materya/pulumi/commit/04de608a360d919dac46eec6150f4ceb30620fbf))
* remove tools -> moved to @materya/carbon ([a20a453](https://github.com/materya/pulumi/commit/a20a4535833711517bf83bb246c1252b127f481b))
* **deps:** updates ([3ba5623](https://github.com/materya/pulumi/commit/3ba56237ffcf35ea02544bb378d03f5465f41faf))


### Bug Fixes

* export of main module k8s ([15ec021](https://github.com/materya/pulumi/commit/15ec021f2bb69259dffe8ee53f18fa5ee3670664))
* **deps:** bump versions ([4d1584f](https://github.com/materya/pulumi/commit/4d1584f94cf9ba9e9a3ddb03951a8975d4a56920))
* **deps:** vulnerabilities ([3c82196](https://github.com/materya/pulumi/commit/3c821961a3b1458b7d8f73f9aa3f62e93b0ab86c))
* Makefile missing vars ([3558e23](https://github.com/materya/pulumi/commit/3558e233a7b9be895bc7c116aeea14e88361860d))

## [1.1.0-beta.0](https://github.com/materya/pulumi/compare/v1.0.0...v1.1.0-beta.0) (2020-05-12)


### Features

* add gcp & k8s comps from previous project ([0c828d4](https://github.com/materya/pulumi/commit/0c828d4ed81441720d3ba304311f01383cded88e))

## [1.0.0](https://github.com/materya/pulumi/compare/v1.0.0-beta.4...v1.0.0) (2020-04-30)


### Features

* add tools module ([3b5a9b6](https://github.com/materya/pulumi/commit/3b5a9b6bb5dde2b48a20fd20a3ea41a656d1ef3d))

## [1.0.0-beta.4](https://github.com/materya/pulumi/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2020-04-22)


### Bug Fixes

* **packaging:** main definition file ([05e2f19](https://github.com/materya/pulumi/commit/05e2f1975f160c59415fe6546c2a82c3251ca057))

## [1.0.0-beta.3](https://github.com/materya/pulumi/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-04-22)

## [1.0.0-beta.2](https://github.com/materya/pulumi/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-04-20)


### Bug Fixes

* **aws.Zone:** missing records creation ([12be84c](https://github.com/materya/pulumi/commit/12be84ce3447cf02a55dd19fd040c2d1f43fec14))
