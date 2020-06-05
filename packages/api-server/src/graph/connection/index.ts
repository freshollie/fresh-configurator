import * as uuid from "uuid";
import gql from "graphql-tag";
import { ApolloError } from "apollo-server";
import { mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import debug from "debug";
import device from "./device";
import { Resolvers } from "../__generated__";

const log = debug("api-server:connection");

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
    connect: async (_, { port, baudRate }, { connections, api }) => {
      let deviceId: string | undefined;
      const connectionId = uuid.v4();

      const connect = async (retries = 0): Promise<void> => {
        if (deviceId && !connections.getPort(connectionId)) {
          log("connection is now closed, ignoring reconnect");
          return;
        }

        try {
          log(`opening ${port}`);
          // open the connection, and if the connection closes
          // try to reconnect
          await api.open(port, { baudRate }, () =>
            setTimeout(() => connect(0), 1000)
          );

          // ensure that after we have connected that
          // this is the same device which we originally connected to
          if (deviceId && deviceId !== (await api.readUID(port))) {
            log(
              "the connection has restarted, but the device is not the same as expected"
            );
            connections.closeConnection(connectionId);
          }
        } catch (e) {
          // as we were not previously open
          // throw an error
          if (!deviceId) {
            throw e;
          }

          // otherwise, try again
          if (retries < 2) {
            log("error connecting, trying again");
            log(e);
            setTimeout(() => connect(retries + 1), 1000);
          } else {
            log("ran out of retries closing");
            connections.closeConnections(port);
          }
        }
      };

      await connections.connectLock(port, async () => {
        if (!api.isOpen(port)) {
          try {
            await connect();
          } catch (e) {
            throw new ApolloError(`Could not open port: ${e.message}`);
          }
        }
        deviceId = await api.readUID(port);
      });

      // Close any existing connections
      connections.closeConnections(port);
      // start a new connection with a new connection id
      connections.add(port, connectionId);

      return {
        id: connectionId,
        port,
      };
    },

    close: async (_, { connectionId }, { connections, api }) => {
      const port = connections.getPort(connectionId);
      await api.close(port);
      connections.closeConnections(port);
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
