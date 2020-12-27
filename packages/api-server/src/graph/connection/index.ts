import * as uuid from "uuid";
import gql from "graphql-tag";
import { ApolloError } from "apollo-server-express";
import { mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import debug from "debug";
import device from "./device";
import { Resolvers } from "../__generated__";

const log = debug("api-server:connection");

const typeDefs = gql`
  type Subscription {
    onConnectionChanged(connectionId: ID!): ID
    onReconnecting(connectionId: ID!): ID!
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
    onConnectionChanged: {
      subscribe: (_, { connectionId }, { connections }) => {
        if (!connections.isOpen(connectionId)) {
          throw new ApolloError("Connection is not open");
        }
        return connections.onChanged(connectionId);
      },
      resolve: (connectionId: string) => connectionId,
    },
    onReconnecting: {
      subscribe: (_, { connectionId }, { connections }) => {
        if (!connections.isOpen(connectionId)) {
          throw new ApolloError("Connection is not open");
        }
        return connections.onReconnecting(connectionId);
      },
      resolve: (connectionId: string) => connectionId,
    },
  },

  Mutation: {
    connect: async (_, { port, baudRate }, { connections, api }) => {
      let deviceId: string | undefined;
      let connectionId = uuid.v4();

      const connect = async (retries = 1): Promise<void> => {
        if (deviceId && !connections.isOpen(connectionId)) {
          log("connection is now closed, ignoring reconnect");
          return;
        }

        try {
          log(`opening ${port}, connectionId=${connectionId}`);
          // open the connection, and if the connection closes
          // try to reconnect
          await api.open(port, { baudRate }, () => {
            log(
              `connection closed for ${port}, reconnecting in 3 seconds, connectionId=${connectionId}`
            );
            connections.setReconnecting(connectionId, 1);
            setTimeout(() => connect(), 1000);
          });
          log(`opened for ${port} successfully, connectionId=${connectionId}`);

          if (!deviceId) {
            return;
          }
          // ensure that after we have connected that
          // this is the same device which we originally connected to
          if (deviceId !== (await api.readUID(port))) {
            log(
              `connectionId=${connectionId} has restarted, but the device is not the same as expected`
            );
            connections.close(connectionId);
          } else {
            log(`connectionId=${connectionId} reopened for port=${port}`);
            // As the device has now reconnected
            // let the users of this connection know
            // that there is a new connection id
            // and then close the old connection id
            const newConnectionId = uuid.v4();
            connections.change(connectionId, newConnectionId);
            connectionId = newConnectionId;
          }
        } catch (e) {
          // as we were not previously open
          // throw an error
          if (!deviceId) {
            log(`Error opening ${port}`, e);
            throw e;
          }

          // otherwise, try again
          if (retries < 5) {
            log(
              `connection=${connectionId} error reconnecting, trying again in 3 seconds`
            );
            log(e);
            connections.setReconnecting(connectionId, retries + 1);
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
