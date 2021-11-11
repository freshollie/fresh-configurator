# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.4.0](https://github.com/freshollie/fresh-configurator/compare/@betaflight/msp@0.3.0...@betaflight/msp@0.4.0) (2021-11-11)


### Bug Fixes

* **msp:** improved code ([e824965](https://github.com/freshollie/fresh-configurator/commit/e82496550ec86ed684dc90c119757afbfabea177))


### Features

* **api:** added mixer config api ([50b0c19](https://github.com/freshollie/fresh-configurator/commit/50b0c1923d5f125d7d4359228853448c9b1c04c5))
* **api:** include info in ports api ([5478100](https://github.com/freshollie/fresh-configurator/commit/5478100e46a23af1ce991ce2e24b10de4cf020e7))
* **api:** provide baudRate for connection ([c27a9d0](https://github.com/freshollie/fresh-configurator/commit/c27a9d0ef8fa4265075ea206253003e4db41132a))
* **api:** start writing blackbox api ([bbd3926](https://github.com/freshollie/fresh-configurator/commit/bbd39266348b26610898dad304b1388a1304639f))
* **configurator:** use web serial when run in browser ([#61](https://github.com/freshollie/fresh-configurator/issues/61)) ([9e88ec0](https://github.com/freshollie/fresh-configurator/commit/9e88ec04e4dea8d8686d273357545cb586060901))
* **msp:** allow responses to be checked for match ([88970a1](https://github.com/freshollie/fresh-configurator/commit/88970a12b7fefdca3d0d4af754997da3fb4c589c))





# [0.3.0](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/compare/@betaflight/msp@0.2.0...@betaflight/msp@0.3.0) (2020-06-05)


### Bug Fixes

* **msp:** fix issues with read8 on MspDataView, better logging, start tests for dataview ([7835832](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/7835832c3907804696aa7634b115c5b84cd196bc))


### Features

* **msp:** added better detection for device disconnect, reject all pending requests on connection close ([23c693a](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/23c693a9ffe0bb496400f8f2eb459e2ce62b45b5))





# 0.2.0 (2020-05-15)


### Features

* **configurator:** created reset functionality, downgrade to AC2 ([f504eee](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/f504eee0f0c2f997296637da4ec13cddadfa8cdb))



## 0.1.1 (2020-04-16)


### Bug Fixes

* **backend:** fixed wrong types, started adding tests ([22ef371](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/22ef371b0243e0efb68d668a721032d535d580d5))
* **configurator:** continue pipeline, add footer to landing ([5a201c3](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/5a201c369a7ca3e980c5a99a995253fc2129255e))
* **configurator:** fixed bad base version ([d19bc0f](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/d19bc0f4d90b21b3e0b315e5ff45740b8901876d))
* **msp:** fix readOSDConfig issues ([c61da0d](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/c61da0d8bc3cbd0834604a18e4dbc5139843972b))
* **msp:** updated tests for new api ([16f3d02](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/16f3d027653f3ed8d877c2c08ccdc25c513b8278))


### Features

* restructure project, extract betaflight api from msp, rename project to betaflight ([4cc3956](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/4cc39561a28af15d75eadc64bdc025dbd664f8e5))
* **configurator:** better theme mangement for storybook, continued adding components ([0375764](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/0375764f250f894c2efe946303e43c69351c4b4a))
* **configurator:** continue components, start on indicators ([7c6f859](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/7c6f859b0afae19c69f63b5348fdd0f7a5d81eda))
* **configurator:** continue creating components and functionality ([79295a8](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/79295a8454c3ae1d46ae1f8ccc4d659b20cc9b66))
* **configurator:** continue creating, fix bugs, added connection verification functionality ([1790da6](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/1790da62e535d909be2a691122621b583d3a6c68))
* **configurator:** created channels display, restructure MSP ([eb00c7d](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/eb00c7da4de2554335e0e80727c215e5eb783f39))
* **configurator:** finish gps summary ([8f571bf](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/8f571bfa245450e71d2a42dd995da7175dd0459f))
* **configurator:** start RcModelViewProvider ([045b60a](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/045b60a3d6e9f7a43042bbeeec11d669309bddf6))
* **msp:** added accelerometer calibration ([b996875](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/b9968753bd7fd97135539003da54da863dded34d))
* **msp:** create osd write api ([52dd7d4](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/52dd7d469b73f1f8211c424efeea9e0be519cee7))
* **msp:** finish initial osd read rewrite ([f9d32e2](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/f9d32e263309883fc970190fd1488f70b31ef686))
* **msp:** parse flags in readExtendedStatus, changed readFeatures ([17baf6e](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/17baf6e0d8d1f37d7a3115ccd5b1a2f2025e7be0))
* **msp:** write arming ([f02e2af](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/f02e2af03db4c5a27ddc32274c81d567681d2d24))
* added bytes written and bytes read api to msp ([72892d7](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/72892d7de9868b9341c87566d42ab83f56d33234))
* continue features, fix connection state, restructure ([ac9152d](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/ac9152d7b67de63cb01ef4c717b2230bd85c3b2e))
* continue porting MSP functions, start OSD work ([88d6fe0](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/88d6fe07f2025ea887063502b39c1e9f500a2645))
* finish status provider, start writing logging ([837f3fe](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/837f3fe4f3b6853f48afed673d83439dc1f4843a))
* readme, storybook, others ([c647baa](https://github.com/freshollie/fresh-configurator/tree/master/packages/msp/commit/c647baaddf16fd8f9f34a572151130c4ba35baf2))
