# Fresh configurator

> A re-write of the Betaflight configurator

[![Pipeline status](https://github.com/freshollie/fresh-configurator/workflows/pipeline/badge.svg)](https://github.com/freshollie/fresh-configurator/actions)
[![Coverage Status](https://coveralls.io/repos/github/freshollie/fresh-configurator/badge.svg?branch=master)](https://coveralls.io/github/freshollie/fresh-configurator?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://freshollie.github.io/fresh-configurator)

<p align="center">
  <img width="700" src="./docs/progress.png">
</p>

## What is this?

This is a **from-scratch** re-write of the [betaflight configurator](https://github.com/betaflight/betaflight-configurator) which is attempting to replace the software with more a modern and
correct approach.

The current configurator is both written without a UI framework (apart from jQuery),
and doesn't utilise any of the modern javascript tooling and package management which
exist today.

The aim of this rewrite is to show how the software could be vastly improved
and simplified, and that by doing so attract more contribution to the software.

It would also allow for easier refactoring and redesigning of the UI.

## What's happening right now?

At the moment functionality is very minimal, and lots is changing all the time.

- The MultiWii protocol sourcecode has been ported into Typescript, and utilises promises. It's available in the [@betaflight/msp](packages/msp) package.
- [Tests have been written](packages/msp/test) for all of `@betaflight/msp`
- The Betaflight API has been ported into [`@betaflight/api`](packages/api), and has some tests
- The main layout, device connection controls, logging, model information, navigation, instruments, receiver channels have been written
- [Storybook](https://freshollie.github.io/fresh-configurator) is utlised to develop components

## What's the plan?

Idealy, to become feature complete with the current configurator. The overall goal of the project, however, is to simplify the requirements to develop your own configurator or customise an existing one.

Because `@betaflight/msp` is written separately it could be published as it's own package, available for anyone to build tools which can interact with flight controllers. As `@betaflight/api` is also separate, it provides the ability for people to publish tools which can integrate with betaflight, just by using the API.

## Packages
Project | Description
--- | ---
[@betaflight/configurator](packages/configurator) | The betaflight configurator electron application, built using the rest of the libraries
[@betaflight/api-server](packages/api-server) | A GraphQL server to read data from betaflight flight controllers, built using the @betaflight/api
[@betaflight/api](packages/api) | The betaflight API, built using @betaflight/msp
[@betaflight/msp](packages/msp) | A library for handling the MultiWii Serial Protocol for reading and writing data to flight controllers

## Developing

**PLEASE NOTE, THIS SOFTWARE IS WORK IN PROGRESS AND THINGS ARE CHANGING ALL THE TIME**

```bash
$ yarn
```

### Running the application

```
$ yarn start
```

### Component development environment

```
$ yarn storybook
```

### Compile library changes

```
$ yarn prepare
```

### Tests

Tests can be run across the entire codebase at once

```
$ yarn test
```
