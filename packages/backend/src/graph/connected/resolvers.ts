import * as uuid from "uuid";
import { ApolloError } from "apollo-server";
import { Resolvers } from "../__generated__";

const resolvers: Resolvers = {
  Subscription: {
    onClosed: {
      subscribe: (_, { connection }, { connections }) =>
        connections.onClosed(connection),
      resolve: (connectionId: string) => connectionId,
    },
  },

  Mutation: {
    connect: (_, { port, baudRate }, { connections, msp }) =>
      connections.lock(port, async () => {
        if (!msp.isOpen(port)) {
          try {
            await msp.open(port, { baudRate }, () => {
              // remove any connections if the port closes
              connections.remove(port);
            });
          } catch (e) {
            throw new ApolloError(
              `Could not open connection to ${port}: ${e.message}`
            );
          }
        }

        // Close any existing connections
        connections.remove(port);

        // start a new connection with a new connection id
        const connectionId = uuid.v4();
        connections.add(port, connectionId);

        return connectionId;
      }),

    close: async (_, { connection }, { connections, msp }) => {
      const port = connections.getPort(connection);
      if (!port) {
        throw new ApolloError(`${connection} is not a valid connection`);
      }

      await msp.close(port);
      connections.remove(port);
      return connection;
    },
  },
};

export default resolvers;
