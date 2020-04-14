# `@betaflight/api-server
> A GraphQL server for querying flight controller data

## Usage

```typescript
import server from "@betaflight/api-server";

server.listen(9000)
```

Then, you can query the graph at `http://localhost:9000/graphql`

### Ports

```graphql

query {
    ports
}

```

### Connecting

```graphql
mutation Connect($port: String!) {
    connect(port: $port, baudRate: 115200) {
        id # the connectionId
        apiVersion # the api version of the flight controller
    }
}
```

### Querying

```graphql
query GetAttitude($connectionId: ID!) {
    device(connection: $connectionId) {
        attitude {
            roll
            pitch
            heading
        }
    }
}
```

For more usage examples, please refer to [`@betaflight/configurator`](../configurator) which uses this package
to communicate with flight controllers

## Why?

GraphQL is a powerful langauge, and this structure would have had to be implemented in the configurator for client
state anyway. Splitting the flight controller graph into it's own API means we both create a segregated architecture
for the configurator and allow other people to use the API for other means.
