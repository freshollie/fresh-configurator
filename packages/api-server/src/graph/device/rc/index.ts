import gql from "graphql-tag";
import { Resolvers } from "../../__generated__";

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
      __typename: "RC",
    }),
  },

  RC: {
    channels: ({ port }, _, { msp }) => msp.readRcValues(port),
    tuning: ({ port }, _, { msp }) =>
      msp.readRCTuning(port).then((values) => ({
        ...values,
        __typename: "RCTuning",
      })),
    deadband: ({ port }, _, { msp }) =>
      msp.readRCDeadband(port).then((values) => ({
        ...values,
        __typename: "RCDeadband",
      })),
    rssi: ({ port }, _, { msp }) =>
      msp.readAnalogValues(port).then(({ rssi }) => rssi),
  },
};

export default { resolvers, typeDefs };
