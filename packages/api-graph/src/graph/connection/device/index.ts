import gql from "graphql-tag";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { Resolvers } from "../../__generated__";

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
import serial from "./serial";
import alignment from "./alignment";
import pid from "./pid";
import motors from "./motors";
import beepers from "./beeper";
import modes from "./modes";
import blackbox from "./blackbox";

const typeDefs = gql`
  extend type Connection {
    device: FlightController!
  }

  extend type Mutation {
    deviceReset(connectionId: ID!): Boolean
  }

  type FlightController {
    variant: String!
    name: String!
  }
`;

const resolvers: Resolvers = {
  Connection: {
    device: () => ({} as never),
  },
  Mutation: {
    deviceReset: (_, { connectionId }, { api, connections }) =>
      api.resetConfig(connections.getPort(connectionId)).then(() => null),
  },
  FlightController: {
    variant: (_, __, { port, api }) => api.readFcVariant(port),
    name: (_, __, { port, api }) => api.readName(port),
  },
};

export default {
  typeDefs: mergeTypeDefs([
    typeDefs,
    arming.typeDefs,
    alignment.typeDefs,
    attitude.typeDefs,
    features.typeDefs,
    gps.typeDefs,
    info.typeDefs,
    power.typeDefs,
    profiles.typeDefs,
    rc.typeDefs,
    sensors.typeDefs,
    status.typeDefs,
    serial.typeDefs,
    pid.typeDefs,
    motors.typeDefs,
    beepers.typeDefs,
    modes.typeDefs,
    blackbox.typeDefs,
  ]),
  resolvers: mergeResolvers([
    resolvers,
    arming.resolvers,
    alignment.resolvers,
    attitude.resolvers,
    features.resolvers,
    gps.resolvers,
    info.resolvers,
    power.resolvers,
    profiles.resolvers,
    rc.resolvers,
    sensors.resolvers,
    status.resolvers,
    serial.resolvers,
    pid.resolvers,
    motors.resolvers,
    beepers.resolvers,
    modes.resolvers,
    blackbox.resolvers,
  ]),
};
