## Frequent issues

### Cannot find module '../gql/..../Something.graphql' / cannot find module '__generated__'

#### Problem

Seems your graphql types have not been generated

#### Solution

`yarn codegen` to generate the graphql types so that the configurator
knows the expected datatypes 
