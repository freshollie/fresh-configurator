# `@betaflight/api-graph`
> Betaflight in a graph

A GraphQL schema for querying, and mutatating betaflight flight controllers

## Usage

TODO

### Ports

```graphql

query Ports {
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

### Listen for connection changes

```graphql
subscription OnChanged($id: ID!) {
    onConnectionChanged(connection: $id)
}
```

### Querying

```graphql
query Attitude($connection: ID!) {
    connection(connectionId: $connection) {
        device {
            attitude {
                roll
                pitch
                heading
            }
        }
        bytesRead
        bytesWritten
        packetErrors
    }
}
```

For more usage examples, please refer to [`@betaflight/configurator`](../configurator) which uses this package
to communicate with flight controllers

## Why?

GraphQL is a powerful langauge, and this structure would have had to be implemented in the configurator for client
state anyway. Splitting the flight controller graph into it's own API means we both create a segregated architecture
for the configurator and allow other people to use the API for other means.
