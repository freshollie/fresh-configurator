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
    rcRate: Int!
    rcExpo: Int!
    rollPitchRate: Int!
    pitchRate: Int!
    rollRate: Int!
    yawRate: Int!
    dynamicThrottlePid: Int!
    throttleMid: Int!
    throttleExpo: Int!
    dynamicThrottleBreakpoint: Int!
    rcYawExpo: Int!
    rcYawRate: Int!
    rcPitchRate: Int!
    rcPitchExpo: Int!
    throttleLimitType: Int!
    throttleLimitPercent: Int!
    rollRateLimit: Int!
    pitchRateLimit: Int!
    yawRateLimit: Int!
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
