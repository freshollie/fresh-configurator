# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.4.0](https://github.com/freshollie/fresh-configurator/compare/@betaflight/api@0.3.0...@betaflight/api@0.4.0) (2021-11-11)


### Bug Fixes

* **api:** ffixed msp2 serial api ([9cbcbf5](https://github.com/freshollie/fresh-configurator/commit/9cbcbf583e3bdad4de8b607e00d64d812455e7ba))
* **api:** fixed beeperConfig read and write ([2ca14a1](https://github.com/freshollie/fresh-configurator/commit/2ca14a15ca4754f7a910f937451d8775afa31dc8))
* **api:** fixed modes for version 1.43.0 ([15cebba](https://github.com/freshollie/fresh-configurator/commit/15cebbaa65a6c67ba1430f0e53b301fecf491258))
* **api:** use percentage for rssi value ([03f2656](https://github.com/freshollie/fresh-configurator/commit/03f26569c5a54de7cb8def6c7027b3b876bcaf4a))
* **codegen:** fixed codegen configuration, removed graphql-let ([6265416](https://github.com/freshollie/fresh-configurator/commit/6265416c998b5a2110acb3b5b300f450340afe74))


### Features

* allow receiver serial protocol to be set, api-server refactor ([af79195](https://github.com/freshollie/fresh-configurator/commit/af79195ce4c386a71bf945114d4eb4ada4d5301f))
* **api-graph:** finish OSD api resolvers ([#59](https://github.com/freshollie/fresh-configurator/issues/59)) ([359a784](https://github.com/freshollie/fresh-configurator/commit/359a7843c5bba6978d75a715ba81fb22216f94f8))
* **api-server:** implement initial blackbox api ([cdbfdfc](https://github.com/freshollie/fresh-configurator/commit/cdbfdfc1b2953051e4de3182aa76545fb921876d))
* **api:** added mixer config api ([50b0c19](https://github.com/freshollie/fresh-configurator/commit/50b0c1923d5f125d7d4359228853448c9b1c04c5))
* **api:** added readName, readFcVariant, writePartialBlackboxConfig ([325e4ce](https://github.com/freshollie/fresh-configurator/commit/325e4ce07bfedcb77046a46ca8fce14cf111027f))
* **api:** additions to OSD api ([#57](https://github.com/freshollie/fresh-configurator/issues/57)) ([5ba9092](https://github.com/freshollie/fresh-configurator/commit/5ba909285ad4f0f7911f935672106bd8b3203887))
* **api:** create battery and meter apis ([50e9aba](https://github.com/freshollie/fresh-configurator/commit/50e9abaf3b091e8f6e21c6d70ff0c3ec2ebde5db))
* **api:** create pid apis ([6dffa8e](https://github.com/freshollie/fresh-configurator/commit/6dffa8e18238f32cb4498c86624858436c49bdc6))
* **api:** create vtx config api ([#54](https://github.com/freshollie/fresh-configurator/issues/54)) ([68cf39a](https://github.com/freshollie/fresh-configurator/commit/68cf39ac82baf217016d0381f8f7be96de1533c5))
* **api:** provide baudRate for connection ([c27a9d0](https://github.com/freshollie/fresh-configurator/commit/c27a9d0ef8fa4265075ea206253003e4db41132a))
* **api:** read and write rxConfig, refactor api ([4754bfe](https://github.com/freshollie/fresh-configurator/commit/4754bfe2c995803db1f4f2037aba72f98d92f945))
* **api:** start writing blackbox api ([bbd3926](https://github.com/freshollie/fresh-configurator/commit/bbd39266348b26610898dad304b1388a1304639f))
* **api:** unpack target capabilities ([95cb44d](https://github.com/freshollie/fresh-configurator/commit/95cb44df8d9d5d1b693edde218c8e91d1af42614))
* auxiliary switch mode bindings ([#28](https://github.com/freshollie/fresh-configurator/issues/28)) ([54f9eb4](https://github.com/freshollie/fresh-configurator/commit/54f9eb45d18e21830e38026d168aa5d45e4068e0))
* **configurator:** blackbox settings and flash download ([91a8293](https://github.com/freshollie/fresh-configurator/commit/91a8293ae5685fef143e47cb22efeb26029c707a))
* **configurator:** use web serial when run in browser ([#61](https://github.com/freshollie/fresh-configurator/issues/61)) ([9e88ec0](https://github.com/freshollie/fresh-configurator/commit/9e88ec04e4dea8d8686d273357545cb586060901))
* configure receiver port ([837aca9](https://github.com/freshollie/fresh-configurator/commit/837aca952ca003bf43d2e60437fac50c1ebc40f9))
* disable sensors ([ee2bc2d](https://github.com/freshollie/fresh-configurator/commit/ee2bc2de349e645c9f333585eb161c028c4a3132))
* edit board alignment config ([05493da](https://github.com/freshollie/fresh-configurator/commit/05493daba3aa2837eb48687868144f74bc781c3c))
* enable pid protocols to be set based on CPU type ([3d0ac25](https://github.com/freshollie/fresh-configurator/commit/3d0ac2506e9ae3e08790d89d7fae39bd76a369db))
* set channel map ([2dfb730](https://github.com/freshollie/fresh-configurator/commit/2dfb7303851248dcf4ae6f8d1d033d9c363a1b71))
* set motor beeper ([660b118](https://github.com/freshollie/fresh-configurator/commit/660b11867b64b1f758151246b79a48ffaa20d7ad))
* set motor idle speed ([e61dbf4](https://github.com/freshollie/fresh-configurator/commit/e61dbf4489c787ef2431d25680cc8236111cf8e1))
* set prop direction ([8358cb8](https://github.com/freshollie/fresh-configurator/commit/8358cb8b247ddba940e60cba800852ee895b722a))
* set rssi channel, fix missing data on query variable change ([c659f6d](https://github.com/freshollie/fresh-configurator/commit/c659f6de1ec7e50f849be5ff5ee1ddf120f590ab))





# [0.3.0](https://github.com/freshollie/fresh-configurator/tree/master/packages/api/compare/@betaflight/api@0.2.0...@betaflight/api@0.3.0) (2020-06-05)


### Features

* **api:** added more read board info tests, added readUID, added writeReboot ([5fef163](https://github.com/freshollie/fresh-configurator/tree/master/packages/api/commit/5fef163d7db9dbb6923ddf7e2d2767b924d17a48))





# 0.2.0 (2020-05-15)


### Features

* **api:** changed osd element positions to object, start ports config ([633cc8c](https://github.com/freshollie/fresh-configurator/tree/master/packages/api/commit/633cc8cc312f3c414ff6a43362f477ea397bfa97))
* **api-server:** added serial query, fixed relative imports, upgrade eslint-typescript-airbnb ([418da88](https://github.com/freshollie/fresh-configurator/tree/master/packages/api/commit/418da881d80f04f8cd78f9f138fecb725845e6f9))
* **api-server:** created mock api, deploy mocks to heroku ([df4d2b4](https://github.com/freshollie/fresh-configurator/tree/master/packages/api/commit/df4d2b456d6dac1147b5f8732eda5e383dcb8af4))
* **configurator:** created reset functionality, downgrade to AC2 ([f504eee](https://github.com/freshollie/fresh-configurator/tree/master/packages/api/commit/f504eee0f0c2f997296637da4ec13cddadfa8cdb))
* **ports:** completed api-server ports, start work on ports settings table ([73559b0](https://github.com/freshollie/fresh-configurator/tree/master/packages/api/commit/73559b01cbfe49d80ac165139859933e0175f8a9))



## 0.1.1 (2020-04-16)


### Features

* restructure project, extract betaflight api from msp, rename project to betaflight ([4cc3956](https://github.com/freshollie/fresh-configurator/tree/master/packages/api/commit/4cc39561a28af15d75eadc64bdc025dbd664f8e5))
