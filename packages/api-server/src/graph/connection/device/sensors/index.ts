import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    sensors: [Int!]!
  }

  type Mutation {
    deviceCallibrateAccelerometer(connectionId: ID!): Boolean
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    sensors: ({ port }, _, { api }) =>
      api.readExtendedStatus(port).then(({ sensors }) => sensors),
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
  },
};

export default { resolvers, typeDefs };
