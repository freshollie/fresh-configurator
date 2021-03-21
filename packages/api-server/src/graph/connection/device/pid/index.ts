import debug from "debug";
import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const log = debug("api-server:device:pid");

const typeDefs = gql`
  extend type FlightController {
    pid: PidConfig!
  }

  extend type Mutation {
    deviceSetPidProtocols(
      connectionId: ID!
      protocols: PidProtocolsInput!
    ): Boolean
  }

  type PidConfig {
    protocols: PidProtocols!
  }

  type PidProtocols {
    gyroSyncDenom: Int!
    pidProcessDenom: Int!
    useUnsyncedPwm: Boolean!
    fastPwmProtocol: Int!
    gyroUse32kHz: Boolean!
    motorPwmRate: Int!
  }

  input PidProtocolsInput {
    gyroSyncDenom: Int
    pidProcessDenom: Int
    useUnsyncedPwm: Boolean
    fastPwmProtocol: Int
    gyroUse32kHz: Boolean
    motorPwmRate: Int
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    pid: () => ({} as never),
  },
  PidConfig: {
    protocols: (_, __, { api, port }) => api.readAdvancedConfig(port),
  },
  Mutation: {
    deviceSetPidProtocols: (
      _,
      { connectionId, protocols },
      { api, connections }
    ) => {
      log("Setting pid protocols", protocols);
      return api
        .writePartialAdvancedConfig(
          connections.getPort(connectionId),
          protocols
        )
        .then(() => null);
    },
  },
};

export default { typeDefs, resolvers };
