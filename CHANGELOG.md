# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
