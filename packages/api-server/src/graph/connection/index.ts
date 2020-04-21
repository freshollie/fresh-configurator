import * as uuid from "uuid";
import gql from "graphql-tag";
import { ApolloError } from "apollo-server";
import { mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import device from "./device";
import { Resolvers } from "../__generated__";

const typeDefs = gql`
  type Subscription {
    onClosed(connectionId: ID!): ID!
  }

  type Mutation {
    connect(port: String!, baudRate: Int!): Connection!
    close(connectionId: ID!): ID!
  }

  type Query {
    connection(connectionId: ID!): Connection!
  }

  type Connection {
    id: ID!
    port: String!
    apiVersion: String!
    bytesRead: Int!
    bytesWritten: Int!
    packetErrors: Int!
  }
`;

const resolvers: Resolvers = {
  Subscription: {
    onClosed: {
      subscribe: (_, { connectionId }, { connections }) => {
        if (!connections.isOpen(connectionId)) {
          throw new ApolloError("Connection is not open");
        }
        return connections.onClosed(connectionId);
      },
      resolve: (connectionId: string) => connectionId,
    },
  },

  Mutation: {
    connect: (_, { port, baudRate }, { connections, api }) =>
      connections
        .connectLock(port, async () => {
          if (!api.isOpen(port)) {
            try {
              await api.open(port, { baudRate }, () => {
                // remove any connections if the port closes
                connections.remove(port);
              });
            } catch (e) {
              throw new ApolloError(
                `Could not open connection to ${port}: ${e.message}`
              );
            }
          }
        })
        .then(() => {
          // Close any existing connections
          connections.remove(port);

          // start a new connection with a new connection id
          const connectionId = uuid.v4();
          connections.add(port, connectionId);

          return {
            id: connectionId,
            port,
          };
        }),

    close: async (_, { connectionId }, { connections, api }) => {
      const port = connections.getPort(connectionId);
      await api.close(port);
      connections.remove(port);
      return connectionId;
    },
  },

  Query: {
    connection: (_, { connectionId }, { connections }) => ({
      id: connectionId,
      port: connections.getPort(connectionId),
    }),
  },
  Connection: {
    apiVersion: ({ port }, _, { api }) => api.apiVersion(port),
    bytesRead: ({ port }, _, { api }) => api.bytesRead(port),
    bytesWritten: ({ port }, _, { api }) => api.bytesWritten(port),
    packetErrors: ({ port }, _, { api }) => api.packetErrors(port),
  },
};

export default {
  resolvers: mergeResolvers([device.resolvers, resolvers]),
  typeDefs: mergeTypes([device.typeDefs, typeDefs]),
};
