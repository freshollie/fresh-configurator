import gql from "graphql-tag";
import { mergeTypes, mergeResolvers } from "merge-graphql-schemas";

import connected from "./connection";
import ports from "./ports";
import jobs from "./jobs";
import { Context } from "../context";
import { Resolvers } from "./__generated__";

const typeDefs = gql`
  type Query {
    dummy: Boolean
  }
`;

export default {
  resolvers: mergeResolvers<Context, Resolvers>([
    connected.resolvers,
    ports.resolvers,
    jobs.resolvers,
  ]),
  typeDefs: mergeTypes([
    typeDefs,
    connected.typeDefs,
    ports.typeDefs,
    jobs.typeDefs,
  ]),
};
