# Fresh configurator

> A re-write of the Betaflight configurator

## What is this?

This is a new version of the [betaflight configurator](https://github.com/betaflight/betaflight-configurator) which is attempting to re-write the software in more modern technologies.

The current configurator is both written without a UI framework,
and doesn't utilise any of the modern javascript packages and package management which
exist today.

The aim of this rewrite is to show how the software could be vastly improved
and simplified, and that by doing so attract more contribution to the software.

It would also allow for easier refactoring and redesigning of the UI.

## What's happening right now?

At the moment the amount of code is very minimal, and is mostly working on setting up
of the repo and frameworks for development.

- The MultiWii protocol sourcecode has been ported into Typescript, and utilises promises. It's available in the [@fresh/msp](packages/msp) package
- GraphQL has been setup for communication between the UI and the flight controller
- Framework around using electron to build the application has been started, and mostly works
- Storybook has been setup to ease component development

## What's the plan?

Idealy, to become feature complete with the current configurator. The overall goal of the project, however, is to simplify the requirements to develop your own configurator or customise an existing one.
