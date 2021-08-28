import gql from "graphql-tag";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

import connected from "./connection";
import ports from "./ports";
import jobs from "./jobs";

const typeDefs = gql`
  type Query {
    dummy: Boolean
  }
`;

export default {
  resolvers: mergeResolvers([
    connected.resolvers,
    ports.resolvers,
    jobs.resolvers,
  ]),
  typeDefs: mergeTypeDefs([
    typeDefs,
    connected.typeDefs,
    ports.typeDefs,
    jobs.typeDefs,
  ]),
};
