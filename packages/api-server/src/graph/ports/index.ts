import gql from "graphql-tag";
import { Resolvers } from "../__generated__";

const typeDefs = gql`
  extend type Query {
    ports: [String!]!
  }
`;

const resolvers: Resolvers = {
  Query: {
    ports: (_, __, { api }) => api.ports(),
  },
};

export default { resolvers, typeDefs };
