import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    motors: MotorsConfig!
  }

  extend type Mutation {
    deviceSetMotorsDirection(connectionId: ID!, reversed: Boolean!): Boolean
  }

  type MotorsConfig {
    mixer: Int!
    reversedDirection: Boolean!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    motors: ({ port }, _, { api }) =>
      api.readMixerConfig(port).then((config) => ({
        ...config,
        reversedDirection: config.reversedMotors,
      })),
  },
  Mutation: {
    deviceSetMotorsDirection: async (
      _,
      { connectionId, reversed },
      { api, connections }
    ) => {
      await api.writeMotorDirection(
        connections.getPort(connectionId),
        reversed
      );
      return null;
    },
  },
};

export default { typeDefs, resolvers };
