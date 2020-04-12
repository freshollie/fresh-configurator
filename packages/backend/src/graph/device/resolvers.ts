import { Resolvers } from "../__generated__";

const resolvers: Resolvers = {
  Query: {
    device: (_, { connection }, { msp, connections }) => {
      const port = connections.getPort(connection);
      if (!port) {
        throw new Error("device is not connected");
      }

      return {
        port,
        apiVersion: msp.apiVersion(port),
      };
    },
  },
};

export default resolvers;
