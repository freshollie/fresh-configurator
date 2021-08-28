import * as uuid from "uuid";
import gql from "graphql-tag";
import { GraphQLError } from "graphql";
import { mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import debug from "debug";
import device from "./device";
import { Resolvers } from "../__generated__";
import { Context } from "../../context";

const log = debug("api-graph:connection");

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
    baudRate: Int!
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
          throw new GraphQLError("Connection is not open");
        }
        return connections.onChanged(connectionId);
      },
      resolve: (connectionId: string) => connectionId,
    },
    onReconnecting: {
      subscribe: (_, { connectionId }, { connections }) => {
        if (!connections.isOpen(connectionId)) {
          throw new GraphQLError("Connection is not open");
        }
        return connections.onReconnecting(connectionId);
      },
      resolve: (connectionId: string) => connectionId,
    },
  },

  Mutation: {
    connect: async (_, { port, baudRate }, context) => {
      const { connections, api } = context;
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
            throw new GraphQLError(`Could not open port: ${e.message}`);
          }
        }
        deviceId = await api.readUID(port);
      });

      // Close any existing connections
      connections.closeConnections(port);
      // start a new connection with a new connection id
      connections.add(port, connectionId);
      context.port = port;

      return {
        id: connectionId,
        port,
        baudRate,
        apiVersion: "0.0.0",
        bytesRead: 0,
        bytesWritten: 0,
        packetErrors: 0,
        device: {} as never,
      };
    },

    close: async (_, { connectionId }, { connections, api }) => {
      const port = connections.getPort(connectionId);
      await api.close(port);
      connections.close(connectionId);
      connections.closeConnections(port);
      return connectionId;
    },
  },

  Query: {
    connection: (_, { connectionId }, context) => {
      const port = context.connections.getPort(connectionId);
      context.port = port;
      return {
        id: connectionId,
        port,
        baudRate: 0,
        apiVersion: "0.0.0",
        bytesRead: 0,
        bytesWritten: 0,
        packetErrors: 0,
        device: {} as never,
      };
    },
  },
  Connection: {
    apiVersion: ({ port }, _, { api }) => api.apiVersion(port),
    bytesRead: ({ port }, _, { api }) => api.bytesRead(port),
    bytesWritten: ({ port }, _, { api }) => api.bytesWritten(port),
    packetErrors: ({ port }, _, { api }) => api.packetErrors(port),
    baudRate: ({ port, baudRate }, _, { api }) =>
      baudRate > 0 ? baudRate : api.baudRate(port),
  },
};

export default {
  resolvers: mergeResolvers<Context, Resolvers>([device.resolvers, resolvers]),
  typeDefs: mergeTypes([device.typeDefs, typeDefs]),
};
