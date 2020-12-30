import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    rc: RC!
  }

  type RC {
    channels: [Int!]!
    tuning: RCTuning!
    deadband: RCDeadband!
    rssi: Int!
  }

  type RCTuning {
    rcRate: Float!
    rcExpo: Float!
    rollPitchRate: Float!
    pitchRate: Float!
    rollRate: Float!
    yawRate: Float!
    dynamicThrottlePid: Float!
    throttleMid: Float!
    throttleExpo: Float!
    dynamicThrottleBreakpoint: Float!
    rcYawExpo: Float!
    rcYawRate: Float!
    rcPitchRate: Float!
    rcPitchExpo: Float!
    throttleLimitType: Float!
    throttleLimitPercent: Float!
    rollRateLimit: Float!
    pitchRateLimit: Float!
    yawRateLimit: Float!
  }

  type RCDeadband {
    deadband: Int!
    yawDeadband: Int!
    altHoldDeadhand: Int!
    deadband3dThrottle: Int!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    rc: ({ port }) => ({
      port,
    }),
  },

  RC: {
    channels: ({ port }, _, { api }) => api.readRcValues(port),
    tuning: ({ port }, _, { api }) => api.readRCTuning(port),
    deadband: ({ port }, _, { api }) => api.readRCDeadband(port),
    rssi: ({ port }, _, { api }) =>
      api.readAnalogValues(port).then(({ rssi }) => rssi),
  },
};

export default { resolvers, typeDefs };
