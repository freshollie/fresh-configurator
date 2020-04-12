import * as uuid from "uuid";
import { ApolloError } from "apollo-server";
import { Resolvers } from "../__generated__";

const resolvers: Resolvers = {
  Subscription: {
    connected: (_, { id }, { connections }) => connections.subscribe(id),
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
        connections.add(connectionId, port);

        return connectionId;
      }),

    disconnect: async (_, { connection }, { connections, msp }) => {
      const port = connections.getPort(connection);
      if (!port) {
        throw new ApolloError(`{id} is not a valid connection`);
      }

      await msp.close(port);
      connections.remove(port);
      return null;
    },
  },
};

export default resolvers;
