import gql from "graphql-tag";
import { Resolvers } from "../__generated__";

const typeDefs = gql`
  extend type Query {
    ports: [String!]!
  }
`;

const resolvers: Resolvers = {
  Query: {
    ports: (_, __, { msp }) => msp.ports(),
  },
};

export default { resolvers, typeDefs };
