import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    features: [Feature!]!
  }

  type Feature {
    key: Int!
    enabled: Boolean!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    features: ({ port }, _, { api }) => api.readFeatures(port),
  },
};

export default { resolvers, typeDefs };
