import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    motors: MotorsConfig!
  }

  extend type Mutation {
    deviceSetMotorsDirection(connectionId: ID!, reversed: Boolean!): Boolean
    deviceSetDigitalIdleSpeed(
      connectionId: ID!
      idlePercentage: Float!
    ): Boolean
  }

  type MotorsConfig {
    mixer: Int!
    reversedDirection: Boolean!
    digitalIdlePercent: Float!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    motors: ({ port }) => ({ port }),
  },
  MotorsConfig: {
    mixer: ({ port }, _, { api }) =>
      api.readMixerConfig(port).then((config) => config.mixer),
    reversedDirection: ({ port }, _, { api }) =>
      api.readMixerConfig(port).then((config) => config.reversedMotors),
    digitalIdlePercent: ({ port }, _, { api }) =>
      api
        .readAdvancedPidConfig(port)
        .then((config) => config.digitalIdlePercent),
  },
  Mutation: {
    deviceSetMotorsDirection: async (
      _,
      { connectionId, reversed },
      { api, connections }
    ) => {
      await api.writePartialMixerConfig(connections.getPort(connectionId), {
        reversedMotors: reversed,
      });
      return null;
    },
    deviceSetDigitalIdleSpeed: async (
      _,
      { connectionId, idlePercentage },
      { api, connections }
    ) => {
      await api.writePartialAdvancedPidConfig(
        connections.getPort(connectionId),
        { digitalIdlePercent: idlePercentage }
      );
      return null;
    },
  },
};

export default { typeDefs, resolvers };
