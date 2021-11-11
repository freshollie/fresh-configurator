# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.6.0](https://github.com/freshollie/fresh-configurator/compare/@betaflight/configurator@0.5.2...@betaflight/configurator@0.6.0) (2021-11-11)


### Bug Fixes

* **api:** fixed beeperConfig read and write ([2ca14a1](https://github.com/freshollie/fresh-configurator/commit/2ca14a15ca4754f7a910f937451d8775afa31dc8))
* **configurator:** correctly set serial port functions ([68dc0d2](https://github.com/freshollie/fresh-configurator/commit/68dc0d2fc9f651045981c800aea9eb7cb5e19162))
* **configurator:** don't redirect on reconnect when ConnectionProvider has unmounted ([a3ab9c5](https://github.com/freshollie/fresh-configurator/commit/a3ab9c52e181553527701ae5205755a028fce77c))
* **configurator:** ensure ports update with connection changes ([e353c0b](https://github.com/freshollie/fresh-configurator/commit/e353c0bbb97c36bf975b36890ff6a3ecbc4eacaa))
* **configurator:** fix aartifacts directory in mocked production build ([db6fe38](https://github.com/freshollie/fresh-configurator/commit/db6fe38c1136a730e549ba7216c34c25ff252ec9))
* **configurator:** fix build config ([cd06f63](https://github.com/freshollie/fresh-configurator/commit/cd06f63124958eb21c9b14e21b5e316e4fccec1f))
* **configurator:** fixed missing type ([bd4d83a](https://github.com/freshollie/fresh-configurator/commit/bd4d83a074da82f9f442b58e2a5422476e80e49c))
* **configurator:** UI fixes ([be540fa](https://github.com/freshollie/fresh-configurator/commit/be540fade9e61004e24c8f3adaf6470aa6f60979))
* **configurator:** update codegen to fix windows builds ([e09c38e](https://github.com/freshollie/fresh-configurator/commit/e09c38e95e5b18d3c52a65bb0b30876e8a616f15))


### Features

* allow receiver serial protocol to be set, api-server refactor ([af79195](https://github.com/freshollie/fresh-configurator/commit/af79195ce4c386a71bf945114d4eb4ada4d5301f))
* **api-server:** provide new connection id when device reconnects ([f4aea40](https://github.com/freshollie/fresh-configurator/commit/f4aea40886a409238c28da6264f31f27ca761fd4))
* **api:** added mixer config api ([50b0c19](https://github.com/freshollie/fresh-configurator/commit/50b0c1923d5f125d7d4359228853448c9b1c04c5))
* auxiliary switch mode bindings ([#28](https://github.com/freshollie/fresh-configurator/issues/28)) ([54f9eb4](https://github.com/freshollie/fresh-configurator/commit/54f9eb45d18e21830e38026d168aa5d45e4068e0))
* **configurator:** ability to add ports in browser ([cd0d663](https://github.com/freshollie/fresh-configurator/commit/cd0d663457f382dae47c77f8015b85bbf5424e6f))
* **configurator:** add splash screen ([a90b40e](https://github.com/freshollie/fresh-configurator/commit/a90b40e35a605289614662ddff75d10e575046e2))
* **configurator:** added error boundary for app crash ([09b6f07](https://github.com/freshollie/fresh-configurator/commit/09b6f07e613d746d5f4337a1c9453c913a4aaa60))
* **configurator:** blackbox settings and flash download ([91a8293](https://github.com/freshollie/fresh-configurator/commit/91a8293ae5685fef143e47cb22efeb26029c707a))
* **configurator:** change connect button styles ([044b579](https://github.com/freshollie/fresh-configurator/commit/044b57937395a442c42adfce2e4b44ff7b033e41))
* **configurator:** device list tweaks ([09b4447](https://github.com/freshollie/fresh-configurator/commit/09b4447883291d770408ff72cc99b2a52416dedd))
* **configurator:** disable arming when configuration loaded ([90e30b2](https://github.com/freshollie/fresh-configurator/commit/90e30b21b01ace52df2ad3d29c099a79ad85f6e8))
* **configurator:** don't show window until paint ([3a2ebab](https://github.com/freshollie/fresh-configurator/commit/3a2ebaba23b7828972b59dff5a80f65862b046e1))
* **configurator:** download artifacts in browser ([#65](https://github.com/freshollie/fresh-configurator/issues/65)) ([13502bf](https://github.com/freshollie/fresh-configurator/commit/13502bfde403f4162b89c6dbb759eed2705a0479))
* **configurator:** execute schema using webworker in browser ([#66](https://github.com/freshollie/fresh-configurator/issues/66)) ([682c705](https://github.com/freshollie/fresh-configurator/commit/682c705f61be81de56e900b0a1ea504dafeff9c7))
* **configurator:** finish new blackbox settings ([c560f4a](https://github.com/freshollie/fresh-configurator/commit/c560f4adaa89806099220ba0f8eb004d33e3b2bf))
* **configurator:** finish sensor list ([ee63f56](https://github.com/freshollie/fresh-configurator/commit/ee63f563e09b77692ae773a556ef24e1e49fd23d))
* **configurator:** migrate reset manager to new UI ([8601d6e](https://github.com/freshollie/fresh-configurator/commit/8601d6e7c726d3bfc91213e257b99f7de82659ca))
* **configurator:** new home screen layout ([e177b72](https://github.com/freshollie/fresh-configurator/commit/e177b729d5b9fd722bef67306c78e3074fc3edf9))
* **configurator:** radio and motor settings ([06de005](https://github.com/freshollie/fresh-configurator/commit/06de005dc3a95f37820e18cda7fdee6d9dd2c8a0))
* **configurator:** show rejection errors ([947db1e](https://github.com/freshollie/fresh-configurator/commit/947db1e0983f3e1c1758d84bdd7e272c436809f4))
* **configurator:** start redesign ([6b488da](https://github.com/freshollie/fresh-configurator/commit/6b488da52ff356a68a5c7ccec9ef2c5465d08883))
* **configurator:** use electron ipc transport ([cd2b92e](https://github.com/freshollie/fresh-configurator/commit/cd2b92eb2adea10842279fe7be9dc173c63b6145))
* **configurator:** use temp directory for artifacts ([f601af4](https://github.com/freshollie/fresh-configurator/commit/f601af4338a584af8464e37b43cfaa2ee05e6cbd))
* **configurator:** use web serial when run in browser ([#61](https://github.com/freshollie/fresh-configurator/issues/61)) ([9e88ec0](https://github.com/freshollie/fresh-configurator/commit/9e88ec04e4dea8d8686d273357545cb586060901))
* configure receiver port ([837aca9](https://github.com/freshollie/fresh-configurator/commit/837aca952ca003bf43d2e60437fac50c1ebc40f9))
* disable sensors ([ee2bc2d](https://github.com/freshollie/fresh-configurator/commit/ee2bc2de349e645c9f333585eb161c028c4a3132))
* edit board alignment config ([05493da](https://github.com/freshollie/fresh-configurator/commit/05493daba3aa2837eb48687868144f74bc781c3c))
* enable persisted queries ([#17](https://github.com/freshollie/fresh-configurator/issues/17)) ([51fcda1](https://github.com/freshollie/fresh-configurator/commit/51fcda10b8ed2c021ad3b1bb6ec1497e3a6be94f))
* enable pid protocols to be set based on CPU type ([3d0ac25](https://github.com/freshollie/fresh-configurator/commit/3d0ac2506e9ae3e08790d89d7fae39bd76a369db))
* set channel map ([2dfb730](https://github.com/freshollie/fresh-configurator/commit/2dfb7303851248dcf4ae6f8d1d033d9c363a1b71))
* set motor beeper ([660b118](https://github.com/freshollie/fresh-configurator/commit/660b11867b64b1f758151246b79a48ffaa20d7ad))
* set motor idle speed ([e61dbf4](https://github.com/freshollie/fresh-configurator/commit/e61dbf4489c787ef2431d25680cc8236111cf8e1))
* set prop direction ([8358cb8](https://github.com/freshollie/fresh-configurator/commit/8358cb8b247ddba940e60cba800852ee895b722a))
* set rssi channel, fix missing data on query variable change ([c659f6d](https://github.com/freshollie/fresh-configurator/commit/c659f6de1ec7e50f849be5ff5ee1ddf120f590ab))





## [0.5.2](https://github.com/freshollie/fresh-configurator/compare/@betaflight/configurator@0.5.1...@betaflight/configurator@0.5.2) (2020-06-05)


### Bug Fixes

* **configurator:** correctly find available port to create api-server ([9eb8616](https://github.com/freshollie/fresh-configurator/commit/9eb8616cc1dbce1fc7893e8ec26fd74c9a801dd4))





## [0.5.1](https://github.com/freshollie/fresh-configurator/compare/@betaflight/configurator@0.5.0...@betaflight/configurator@0.5.1) (2020-05-15)


### Bug Fixes

* **configurator:** fix storybook build ([d113a84](https://github.com/freshollie/fresh-configurator/commit/d113a842798c76e865a6b86bd8807d68df54962f))





# [0.5.0](https://github.com/freshollie/fresh-configurator/compare/@betaflight/configurator@0.4.0...@betaflight/configurator@0.5.0) (2020-05-15)


### Bug Fixes

* **configurator:** fix disarm flags, fixed dev environment ([d766771](https://github.com/freshollie/fresh-configurator/commit/d7667717d9924aa9e682196522e83dae8adc686f))
* **configurator:** fix not disconnecting on close, started adding tests, added jest eslint plugin ([cbe29a3](https://github.com/freshollie/fresh-configurator/commit/cbe29a3eedb2a84768c8ddf30dbd7e56cba0d891))
* **configurator:** fixed styling for widgets, added TabRouter tests ([f7efbf7](https://github.com/freshollie/fresh-configurator/commit/f7efbf7e411b37ff0548cdfffe73a734f414a108))
* **configurator:** make sure components always update from data changes ([7dedeea](https://github.com/freshollie/fresh-configurator/commit/7dedeeab1d8ae56627917f480bcb425029742f30))
* **configurator:** simplified connection manager, finished tests ([0564abd](https://github.com/freshollie/fresh-configurator/commit/0564abd27a5b749af249845986a17dc694015bb6))
* **configurator:** useCallback in custom hooks, added more tests ([3d9ad7c](https://github.com/freshollie/fresh-configurator/commit/3d9ad7c056247e5526b276938857ef2d948c19cd))


### Features

* **api-server:** added serial query, fixed relative imports, upgrade eslint-typescript-airbnb ([418da88](https://github.com/freshollie/fresh-configurator/commit/418da881d80f04f8cd78f9f138fecb725845e6f9))
* **api-server:** created mock api, deploy mocks to heroku ([df4d2b4](https://github.com/freshollie/fresh-configurator/commit/df4d2b456d6dac1147b5f8732eda5e383dcb8af4))
* **configurator:** created reset functionality, downgrade to AC2 ([f504eee](https://github.com/freshollie/fresh-configurator/commit/f504eee0f0c2f997296637da4ec13cddadfa8cdb))
* **ports:** completed api-server ports, start work on ports settings table ([73559b0](https://github.com/freshollie/fresh-configurator/commit/73559b01cbfe49d80ac165139859933e0175f8a9))





# [0.4.0](https://github.com/freshollie/fresh-configurator/compare/@betaflight/configurator@0.2.1...@betaflight/configurator@0.4.0) (2020-04-18)


### Bug Fixes

* **configurator:** correctly bundle serialport bindings ([16aca93](https://github.com/freshollie/fresh-configurator/commit/16aca93239f0dd662571f31a0b9ac5852cce387f))


### Features

* **configurator:** added error log for when ports cannot be queried, fix background theme ([8e8ccff](https://github.com/freshollie/fresh-configurator/commit/8e8ccff29c794b7778286e73a0098690a715dcc5))





# [0.3.0](https://github.com/freshollie/fresh-configurator/compare/@betaflight/configurator@0.2.1...@betaflight/configurator@0.3.0) (2020-04-18)


### Features

* **configurator:** added error log for when ports cannot be queried, fix background theme ([8e8ccff](https://github.com/freshollie/fresh-configurator/commit/8e8ccff29c794b7778286e73a0098690a715dcc5))





## [0.2.1](https://github.com/freshollie/electron-configurator/compare/@betaflight/configurator@0.2.0...@betaflight/configurator@0.2.1) (2020-04-17)

**Note:** Version bump only for package @betaflight/configurator





# 0.2.0 (2020-04-16)



## 0.1.1 (2020-04-16)


### Bug Fixes

* **backend:** fixed wrong types, started adding tests ([22ef371](https://github.com/freshollie/electron-configurator/commit/22ef371b0243e0efb68d668a721032d535d580d5))
* **backend:** restructure backend to be compilable ([6e91db0](https://github.com/freshollie/electron-configurator/commit/6e91db06a1e54c1889073c7e8a97e00f857fb2fd))
* **configurator:** added linux category type ([428df61](https://github.com/freshollie/electron-configurator/commit/428df61a01c98489653f3b31822cab4d60a90494))
* **configurator:** added new gyro icon ([7490a55](https://github.com/freshollie/electron-configurator/commit/7490a55e6691d740ab9d2dc606a0c9e8c0b0efce))
* **configurator:** continue pipeline, add footer to landing ([5a201c3](https://github.com/freshollie/electron-configurator/commit/5a201c369a7ca3e980c5a99a995253fc2129255e))
* **configurator:** corrected dark theme issues, import more styling ([c76d018](https://github.com/freshollie/electron-configurator/commit/c76d018bae9c43da946e60c107094b63e22a9e19))
* **configurator:** fix file names ([01613de](https://github.com/freshollie/electron-configurator/commit/01613de1811738af26d89d04400584a8458ec43d))
* **configurator:** fix issues with fc status ([f0c517a](https://github.com/freshollie/electron-configurator/commit/f0c517a943b6a904c5322b6cfb6d575be38974f1))
* **configurator:** fixed bad base version ([d19bc0f](https://github.com/freshollie/electron-configurator/commit/d19bc0f4d90b21b3e0b315e5ff45740b8901876d))
* **configurator:** fixed log from constantly scrolling to the bottom ([0a21db1](https://github.com/freshollie/electron-configurator/commit/0a21db10df74ad7daa8f36929f3f0fdbeec2ae68))
* **configurator:** fixed logs view not always scrolling to bottom after transition ([6fc2cb2](https://github.com/freshollie/electron-configurator/commit/6fc2cb2fc4058fbcf83c1b79383a0bf0f9d035a8))
* **configurator:** pass correct backend address to frontend ([98f8205](https://github.com/freshollie/electron-configurator/commit/98f820594a16d864267eb55f54c6c15673c19726))
* **configurator:** update connection manager to handle aborts properly ([9dd4688](https://github.com/freshollie/electron-configurator/commit/9dd4688b6d34036e48b8ff6ef9acfcbd93fd0cd6))
* **msp:** updated tests for new api ([16f3d02](https://github.com/freshollie/electron-configurator/commit/16f3d027653f3ed8d877c2c08ccdc25c513b8278))


### Features

* **configurator:** added logging to accelerometer callibration ([0bed3a0](https://github.com/freshollie/electron-configurator/commit/0bed3a0dae2ea0c86d10c786ea972576f980e1e1))
* restructure project, extract betaflight api from msp, rename project to betaflight ([4cc3956](https://github.com/freshollie/electron-configurator/commit/4cc39561a28af15d75eadc64bdc025dbd664f8e5))
* **components:** continue making components ([575875f](https://github.com/freshollie/electron-configurator/commit/575875f0c2c4daafced963705a24d210e788df4d))
* **configurator:** added missing data to graph, added FcInfo to setup tab ([1cf7b52](https://github.com/freshollie/electron-configurator/commit/1cf7b5273d07fc9809d0d6dacc4acd4e188496c6))
* **configurator:** added switch component ([2139666](https://github.com/freshollie/electron-configurator/commit/2139666fe23e058d9fe34a5811b871fa1fb21bd5))
* **configurator:** automatically find port for backend to run on ([60f91a4](https://github.com/freshollie/electron-configurator/commit/60f91a4c46f4519e3b282ec1b877051059ed6c34))
* **configurator:** better theme mangement for storybook, continued adding components ([0375764](https://github.com/freshollie/electron-configurator/commit/0375764f250f894c2efe946303e43c69351c4b4a))
* **configurator:** cache models ([aa194cb](https://github.com/freshollie/electron-configurator/commit/aa194cbf97d9a71090b01f235b934abb6356fd25))
* **configurator:** continue components, start on indicators ([7c6f859](https://github.com/freshollie/electron-configurator/commit/7c6f859b0afae19c69f63b5348fdd0f7a5d81eda))
* **configurator:** continue creating components and functionality ([79295a8](https://github.com/freshollie/electron-configurator/commit/79295a8454c3ae1d46ae1f8ccc4d659b20cc9b66))
* **configurator:** continue creating, fix bugs, added connection verification functionality ([1790da6](https://github.com/freshollie/electron-configurator/commit/1790da62e535d909be2a691122621b583d3a6c68))
* **configurator:** continue making components ([67740b2](https://github.com/freshollie/electron-configurator/commit/67740b2f0238007b9a08d3ce76747d1f2f8be700))
* **configurator:** created accelerometer callibration manager, refactor managers, start working on tests ([b07d778](https://github.com/freshollie/electron-configurator/commit/b07d7785189bbf62a6cfdab148ed647028a3ed30))
* **configurator:** created channels display, restructure MSP ([eb00c7d](https://github.com/freshollie/electron-configurator/commit/eb00c7da4de2554335e0e80727c215e5eb783f39))
* **configurator:** created sensor list ([9848387](https://github.com/freshollie/electron-configurator/commit/98483877d1d2124799015370d5eea80dd9e82a3a))
* **configurator:** finish gps summary ([8f571bf](https://github.com/freshollie/electron-configurator/commit/8f571bfa245450e71d2a42dd995da7175dd0459f))
* **configurator:** finish rc model representation ([c3e1846](https://github.com/freshollie/electron-configurator/commit/c3e1846f71edf31a694b5a9a4a02b47a3157f6c5))
* **configurator:** finish splitting resolvers into backend ([b1c1a9e](https://github.com/freshollie/electron-configurator/commit/b1c1a9efb0558fd48aafa3a013cb4a11646bb687))
* **configurator:** finished flight indicators ([ac6e113](https://github.com/freshollie/electron-configurator/commit/ac6e113e7c4aab7aa01199b460ba1d8b63a85944))
* **configurator:** mostly finish landing tab, other fixes ([323737f](https://github.com/freshollie/electron-configurator/commit/323737f66be346a41964b78dde81df6260c4d845))
* **configurator:** start work on meters ([ecf8b1b](https://github.com/freshollie/electron-configurator/commit/ecf8b1bb20350526c52f38dd987d17f95368c74f))
* **configurator:** start working on bundling ([bad94e8](https://github.com/freshollie/electron-configurator/commit/bad94e8c879aba7ff39e0ff37140b83344f2bec5))
* **configurator:** start working on Sensor status ([e07e6ad](https://github.com/freshollie/electron-configurator/commit/e07e6ade865115fb6226a07dd2ef512e8226372a))
* added bytes written and bytes read api to msp ([72892d7](https://github.com/freshollie/electron-configurator/commit/72892d7de9868b9341c87566d42ab83f56d33234))
* continue porting MSP functions, start OSD work ([88d6fe0](https://github.com/freshollie/electron-configurator/commit/88d6fe07f2025ea887063502b39c1e9f500a2645))
* **configurator:** start RcModelViewProvider ([045b60a](https://github.com/freshollie/electron-configurator/commit/045b60a3d6e9f7a43042bbeeec11d669309bddf6))
* continue features, fix connection state, restructure ([ac9152d](https://github.com/freshollie/electron-configurator/commit/ac9152d7b67de63cb01ef4c717b2230bd85c3b2e))
* finish logs viewer ([ad3259e](https://github.com/freshollie/electron-configurator/commit/ad3259ec80bd3ebb2a8eaa7afdb8c509a6f10896))
* finish status provider, start writing logging ([837f3fe](https://github.com/freshollie/electron-configurator/commit/837f3fe4f3b6853f48afed673d83439dc1f4843a))
* readme, storybook, others ([c647baa](https://github.com/freshollie/electron-configurator/commit/c647baaddf16fd8f9f34a572151130c4ba35baf2))
* start creating status bar ([e78925d](https://github.com/freshollie/electron-configurator/commit/e78925d9404279c882bd68666b3e17aeb793743b))
* start working on Landing tab ([58b8905](https://github.com/freshollie/electron-configurator/commit/58b8905d7b9903b662389828c6e751940ae12721))
* **configurator:** finished setup layout, continue work ([8d71f6a](https://github.com/freshollie/electron-configurator/commit/8d71f6ae2c397bf743dde8ddddc1c64048ef1c9e))
