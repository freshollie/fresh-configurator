# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.5.0](https://github.com/freshollie/fresh-configurator/compare/@betaflight/api-server@0.4.0...@betaflight/api-server@0.5.0) (2021-11-11)


### Bug Fixes

* **api-server:** don't throw an error after disconnecting ([503a751](https://github.com/freshollie/fresh-configurator/commit/503a751b10734c59c65f80fae49da89ddb179f58))
* **api-server:** use version of ws which works with bundling ([ff860fa](https://github.com/freshollie/fresh-configurator/commit/ff860fa31fd921c7e9c5f0cfaadd68b92d022aa7))
* **configurator:** fix aartifacts directory in mocked production build ([db6fe38](https://github.com/freshollie/fresh-configurator/commit/db6fe38c1136a730e549ba7216c34c25ff252ec9))


### Features

* allow receiver serial protocol to be set, api-server refactor ([af79195](https://github.com/freshollie/fresh-configurator/commit/af79195ce4c386a71bf945114d4eb4ada4d5301f))
* **api-server:** added variant and name resolvers ([5d0bf33](https://github.com/freshollie/fresh-configurator/commit/5d0bf33b01412740678d10d15b5f82359f38974c))
* **api-server:** finish jobs and blackbox api ([0ebb311](https://github.com/freshollie/fresh-configurator/commit/0ebb311741e890658a915f2d00500fb443896df8))
* **api-server:** implement initial blackbox api ([cdbfdfc](https://github.com/freshollie/fresh-configurator/commit/cdbfdfc1b2953051e4de3182aa76545fb921876d))
* **api-server:** provide new connection id when device reconnects ([f4aea40](https://github.com/freshollie/fresh-configurator/commit/f4aea40886a409238c28da6264f31f27ca761fd4))
* **api-server:** provide option for legacy websocket protocol ([22becd7](https://github.com/freshollie/fresh-configurator/commit/22becd717fd821d2749e05c040e12fe7e19c81d4))
* **api-server:** split schema into api-graph package ([#37](https://github.com/freshollie/fresh-configurator/issues/37)) ([ef294d9](https://github.com/freshollie/fresh-configurator/commit/ef294d97abbc9d38be5aba127fd27a3f112b94fc))
* **api-server:** use normal connections context in mocked mode, added reset mock ([a4268c6](https://github.com/freshollie/fresh-configurator/commit/a4268c6eee7fbe0713dd1dcec052bc3986da170c))
* **api:** added mixer config api ([50b0c19](https://github.com/freshollie/fresh-configurator/commit/50b0c1923d5f125d7d4359228853448c9b1c04c5))
* **api:** create pid apis ([6dffa8e](https://github.com/freshollie/fresh-configurator/commit/6dffa8e18238f32cb4498c86624858436c49bdc6))
* **api:** include info in ports api ([5478100](https://github.com/freshollie/fresh-configurator/commit/5478100e46a23af1ce991ce2e24b10de4cf020e7))
* **api:** provide baudRate for connection ([c27a9d0](https://github.com/freshollie/fresh-configurator/commit/c27a9d0ef8fa4265075ea206253003e4db41132a))
* **api:** read and write rxConfig, refactor api ([4754bfe](https://github.com/freshollie/fresh-configurator/commit/4754bfe2c995803db1f4f2037aba72f98d92f945))
* auxiliary switch mode bindings ([#28](https://github.com/freshollie/fresh-configurator/issues/28)) ([54f9eb4](https://github.com/freshollie/fresh-configurator/commit/54f9eb45d18e21830e38026d168aa5d45e4068e0))
* **configurator:** blackbox settings and flash download ([91a8293](https://github.com/freshollie/fresh-configurator/commit/91a8293ae5685fef143e47cb22efeb26029c707a))
* **configurator:** use electron ipc transport ([cd2b92e](https://github.com/freshollie/fresh-configurator/commit/cd2b92eb2adea10842279fe7be9dc173c63b6145))
* configure receiver port ([837aca9](https://github.com/freshollie/fresh-configurator/commit/837aca952ca003bf43d2e60437fac50c1ebc40f9))
* disable sensors ([ee2bc2d](https://github.com/freshollie/fresh-configurator/commit/ee2bc2de349e645c9f333585eb161c028c4a3132))
* edit board alignment config ([05493da](https://github.com/freshollie/fresh-configurator/commit/05493daba3aa2837eb48687868144f74bc781c3c))
* enable persisted queries ([#17](https://github.com/freshollie/fresh-configurator/issues/17)) ([51fcda1](https://github.com/freshollie/fresh-configurator/commit/51fcda10b8ed2c021ad3b1bb6ec1497e3a6be94f))
* enable pid protocols to be set based on CPU type ([3d0ac25](https://github.com/freshollie/fresh-configurator/commit/3d0ac2506e9ae3e08790d89d7fae39bd76a369db))
* **graphql:** allow multi protocol ws, upgrade deps ([#38](https://github.com/freshollie/fresh-configurator/issues/38)) ([902edf5](https://github.com/freshollie/fresh-configurator/commit/902edf5bdc53b7ec19833ca27a1534d36e81f46d))
* set channel map ([2dfb730](https://github.com/freshollie/fresh-configurator/commit/2dfb7303851248dcf4ae6f8d1d033d9c363a1b71))
* set motor beeper ([660b118](https://github.com/freshollie/fresh-configurator/commit/660b11867b64b1f758151246b79a48ffaa20d7ad))
* set motor idle speed ([e61dbf4](https://github.com/freshollie/fresh-configurator/commit/e61dbf4489c787ef2431d25680cc8236111cf8e1))
* set prop direction ([8358cb8](https://github.com/freshollie/fresh-configurator/commit/8358cb8b247ddba940e60cba800852ee895b722a))
* set rssi channel, fix missing data on query variable change ([c659f6d](https://github.com/freshollie/fresh-configurator/commit/c659f6de1ec7e50f849be5ff5ee1ddf120f590ab))





# [0.4.0](https://github.com/freshollie/fresh-configurator/tree/master/packages/api-server/compare/@betaflight/api-server@0.3.0...@betaflight/api-server@0.4.0) (2020-06-05)


### Features

* **api-server:** automatically reconnect when device disconnects ([a597012](https://github.com/freshollie/fresh-configurator/tree/master/packages/api-server/commit/a597012b33406325723f96edd4c9873cc94757ab))





# [0.3.0](https://github.com/freshollie/fresh-configurator/tree/master/packages/api-server/compare/@betaflight/api-server@0.2.1...@betaflight/api-server@0.3.0) (2020-05-15)


### Features

* **api:** changed osd element positions to object, start ports config ([633cc8c](https://github.com/freshollie/fresh-configurator/tree/master/packages/api-server/commit/633cc8cc312f3c414ff6a43362f477ea397bfa97))
* **api-server:** added serial query, fixed relative imports, upgrade eslint-typescript-airbnb ([418da88](https://github.com/freshollie/fresh-configurator/tree/master/packages/api-server/commit/418da881d80f04f8cd78f9f138fecb725845e6f9))
* **api-server:** created mock api, deploy mocks to heroku ([df4d2b4](https://github.com/freshollie/fresh-configurator/tree/master/packages/api-server/commit/df4d2b456d6dac1147b5f8732eda5e383dcb8af4))
* **configurator:** created reset functionality, downgrade to AC2 ([f504eee](https://github.com/freshollie/fresh-configurator/tree/master/packages/api-server/commit/f504eee0f0c2f997296637da4ec13cddadfa8cdb))
* **ports:** completed api-server ports, start work on ports settings table ([73559b0](https://github.com/freshollie/fresh-configurator/tree/master/packages/api-server/commit/73559b01cbfe49d80ac165139859933e0175f8a9))





## [0.2.1](https://github.com/freshollie/fresh-configurator/tree/master/packages/api-server/compare/@betaflight/api-server@0.2.0...@betaflight/api-server@0.2.1) (2020-04-17)


### Bug Fixes

* **api-server:** corrected exports for types ([c7e5942](https://github.com/freshollie/fresh-configurator/tree/master/packages/api-server/commit/c7e5942b6e9d1caa951cccb559cd5450ec2a6790))





# 0.2.0 (2020-04-16)


### Bug Fixes

* **api-server:** export correctly for commonjs ([9d96a5b](https://github.com/freshollie/fresh-configurator/tree/master/packages/api-server/commit/9d96a5b3e9a1349ae3cb343f72bfcb1cb4604404))



## 0.1.1 (2020-04-16)


### Features

* restructure project, extract betaflight api from msp, rename project to betaflight ([4cc3956](https://github.com/freshollie/fresh-configurator/tree/master/packages/api-server/commit/4cc39561a28af15d75eadc64bdc025dbd664f8e5))
