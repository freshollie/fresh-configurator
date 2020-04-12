import { ApolloError } from "apollo-server";
import { Resolvers } from "../../__generated__";

const resolvers: Resolvers = {
  FlightController: {
    sensors: ({ port }, _, { msp }) =>
      msp.readExtendedStatus(port).then(({ sensors }) => sensors),
  },

  Mutation: {
    deviceCallibrateAccelerometer: (
      _,
      { connection },
      { msp, connections }
    ) => {
      const port = connections.getPort(connection);
      if (!port) {
        throw new ApolloError(`${connection} is not connected`);
      }
      return msp.calibrateAccelerometer(port).then(() => null);
    },
  },
};

export default resolvers;
