import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    features: [Int!]!
  }

  extend type Mutation {
    deviceSetFeatures(connectionId: ID!, features: [Int!]!): Boolean
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    features: (_, __, { api, port }) => api.readEnabledFeatures(port),
  },
  Mutation: {
    deviceSetFeatures: async (
      _,
      { connectionId, features },
      { connections, api }
    ) =>
      api
        .writeEnabledFeatures(connections.getPort(connectionId), features)
        .then(() => null),
  },
};

export default { resolvers, typeDefs };
