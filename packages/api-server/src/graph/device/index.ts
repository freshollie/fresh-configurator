import gql from "graphql-tag";
import { mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import { ApolloError } from "apollo-server";
import { Resolvers } from "../__generated__";

import arming from "./arming";
import attitude from "./attitude";
import features from "./features";
import gps from "./gps";
import info from "./info";
import power from "./power";
import profiles from "./profiles";
import rc from "./rc";
import sensors from "./sensors";
import status from "./status";

const typeDefs = gql`
  extend type Query {
    device(connection: ID!): FlightController!
  }

  type FlightController {
    port: String!
    apiVersion: String!
  }
`;

const resolvers: Resolvers = {
  Query: {
    device: (_, { connection: connectionId }, { msp, connections }) => {
      const port = connections.getPort(connectionId);
      if (!port) {
        throw new ApolloError("Connection is not active");
      }

      return {
        port,
        apiVersion: msp.apiVersion(port),
      };
    },
  },
};

export default {
  typeDefs: mergeTypes([
    typeDefs,
    arming.typeDefs,
    attitude.typeDefs,
    features.typeDefs,
    gps.typeDefs,
    info.typeDefs,
    power.typeDefs,
    profiles.typeDefs,
    rc.typeDefs,
    sensors.typeDefs,
    status.typeDefs,
  ]),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvers: mergeResolvers<unknown, any>([
    resolvers,
    arming.resolvers,
    attitude.resolvers,
    features.resolvers,
    gps.resolvers,
    info.resolvers,
    power.resolvers,
    profiles.resolvers,
    rc.resolvers,
    sensors.resolvers,
    status.resolvers,
  ]),
};
