import gql from "graphql-tag";
import { mergeTypes, mergeResolvers } from "merge-graphql-schemas";

import connected from "./connection";
import device from "./device";
import ports from "./ports";

const typeDefs = gql`
  type Query {
    dummy: Boolean
  }
`;

export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvers: mergeResolvers<unknown, any>([
    connected.resolvers,
    device.resolvers,
    ports.resolvers,
  ]),
  typeDefs: mergeTypes([
    typeDefs,
    connected.typeDefs,
    device.typeDefs,
    ports.typeDefs,
  ]),
};
