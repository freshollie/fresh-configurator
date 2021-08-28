import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    sensors: Sensors!
  }

  type Mutation {
    deviceCallibrateAccelerometer(connectionId: ID!): Boolean
    deviceSetDisabledSensors(
      connectionId: ID!
      disabledSensors: [Int!]!
    ): Boolean
  }

  type Sensors {
    available: [Int!]!
    disabled: [Int!]!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    sensors: () => ({} as never),
  },
  Sensors: {
    available: (_, __, { api, port }) =>
      api.readExtendedStatus(port).then(({ sensors }) => sensors),
    disabled: (_, __, { api, port }) => api.readDisabledSensors(port),
  },

  Mutation: {
    deviceCallibrateAccelerometer: (
      _,
      { connectionId },
      { api, connections }
    ) =>
      api
        .calibrateAccelerometer(connections.getPort(connectionId))
        .then(() => null),
    deviceSetDisabledSensors: (
      _,
      { connectionId, disabledSensors },
      { api, connections }
    ) =>
      api
        .writeDisabledSensors(
          connections.getPort(connectionId),
          disabledSensors
        )
        .then(() => null),
  },
};

export default { resolvers, typeDefs };
