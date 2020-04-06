# Fresh configurator

> A re-write of the Betaflight configurator

[![Pipeline status](https://github.com/freshollie/fresh-configurator/workflows/pipeline/badge.svg)](https://github.com/freshollie/fresh-configurator/actions)
[![Coverage Status](https://coveralls.io/repos/github/freshollie/fresh-configurator/badge.svg?branch=master)](https://coveralls.io/github/freshollie/fresh-configurator?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://freshollie.github.io/fresh-configurator)

<p align="center">
  <img width="460" height="300" src="./docs/progress.png">
</p>

## What is this?

This is a new version of the [betaflight configurator](https://github.com/betaflight/betaflight-configurator) which is attempting to re-write the software in more modern technologies.

The current configurator is both written without a UI framework,
and doesn't utilise any of the modern javascript packages and package management which
exist today.

The aim of this rewrite is to show how the software could be vastly improved
and simplified, and that by doing so attract more contribution to the software.

It would also allow for easier refactoring and redesigning of the UI.

## What's happening right now?

At the moment functionality is very minimal, and lots is changing all the time.

- The MultiWii protocol sourcecode has been ported into Typescript, and utilises promises. It's available in the [@fresh/msp](packages/msp) package.
- Tests have been written for most of `@fresh/msp`
- The main layout, device connection controls, logging, model information, navigation, instruments, receiver channels have been written
- [Storybook](https://freshollie.github.io/fresh-configurator) is utlised to develop components

## What's the plan?

Idealy, to become feature complete with the current configurator. The overall goal of the project, however, is to simplify the requirements to develop your own configurator or customise an existing one.

## Developing

```bash
$ yarn
```

### Running the application

```
$ yarn start
```

### Component development enviroment

```
$ yarn storybook
```

### Compile `@fresh/msp` changes

```
$ yarn prepare
```
