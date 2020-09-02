## Frequent issues

### Cannot find module '../gql/..../Something.graphql' / cannot find module '__generated__'

#### Problem

Seems your graphql types have not been generated

#### Solution

`yarn codegen` to generate the graphql types so that the configurator
knows the expected datatypes 

### NODE_MODULE_VERSION 75. This version of Node.js requires NODE_MODULE_VERSION 72. Please try re-compiling or re-installing

#### Problem

You are probably trying to develop the `@betaflight/msp` package, but your local binaries are designed
for electron

#### Solution

`npm rebuild` to rebuild the binaries for debugging the msp package
`yarn postinstall` to install the binaries for electron again
