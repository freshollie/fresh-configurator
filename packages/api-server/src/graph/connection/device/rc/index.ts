import { Features, SerialPortFunctions } from "@betaflight/api";
import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const RECEIVER_MODES = [
  Features.RX_MSP,
  Features.RX_SPI,
  Features.RX_PPM,
  Features.RX_SERIAL,
];

const typeDefs = gql`
  extend type FlightController {
    rc: RC!
  }

  extend type Mutation {
    deviceSetRcSmoothingConfig(
      connectionId: ID!
      smoothingConfig: RcSmoothingInput!
    ): Boolean
    deviceSetReceiverConfig(
      connectionId: ID!
      receiverConfig: RxConfigInput!
    ): Boolean
    deviceSetReceiverMode(connectionId: ID!, mode: Int): Boolean
    deviceSetReceiverSerialPort(connectionId: ID!, port: Int): Boolean
  }

  type RC {
    channels: [Int!]!
    tuning: RCTuning!
    smoothing: RcSmoothing!
    deadband: RCDeadband!
    rssi: Int!
    receiver: RxConfig!
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

  type RcSmoothing {
    channels: Int!
    type: Int!
    inputCutoff: Int!
    derivativeCutoff: Int!
    inputType: Int!
    derivativeType: Int!
    autoSmoothness: Int!
  }

  type RxConfig {
    # Will be an enum value for "Features.(RX_SPI | RX_PPM | RX_SERIAL)"
    mode: Int
    serialProvider: Int!
    spi: RxSpiConfig!
  }

  type RxSpiConfig {
    protocol: Int!
  }

  input RcSmoothingInput {
    channels: Int
    type: Int
    inputCutoff: Int
    derivativeCutoff: Int
    inputType: Int
    derivativeType: Int
    autoSmoothness: Int
  }

  input RxConfigInput {
    serialProvider: Int
    spi: RxSpiConfigInput
  }

  input RxSpiConfigInput {
    protocol: Int
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    rc: () => ({} as never),
  },

  RC: {
    channels: (_, __, { api, port }) => api.readRcValues(port),
    tuning: (_, __, { api, port }) => api.readRCTuning(port),
    deadband: (_, __, { api, port }) => api.readRCDeadband(port),
    rssi: (_, __, { api, port }) =>
      api.readAnalogValues(port).then(({ rssi }) => rssi),
    receiver: (_, __, { api, port }) =>
      api.readRxConfig(port).then((config) => ({
        mode: 0,
        ...config,
        serial: { provider: config.serialProvider },
      })),
    smoothing: (_, __, { api, port }) =>
      api.readRxConfig(port).then(({ rcSmoothing }) => rcSmoothing),
  },
  Mutation: {
    deviceSetReceiverConfig: (
      _,
      { connectionId, receiverConfig },
      { connections, api }
    ) =>
      api
        .writePartialRxConfig(connections.getPort(connectionId), receiverConfig)
        .then(() => null),
    deviceSetRcSmoothingConfig: (
      _,
      { connectionId, smoothingConfig },
      { connections, api }
    ) =>
      api
        .writePartialRxConfig(connections.getPort(connectionId), {
          rcSmoothing: smoothingConfig,
        })
        .then(() => null),
    deviceSetReceiverMode: async (
      _,
      { connectionId, mode },
      { connections, api }
    ) => {
      if (mode && !RECEIVER_MODES.includes(mode)) {
        throw new Error(
          `Mode must be one of ${RECEIVER_MODES.map(
            (feature) => `Features.${Features[feature]}`
          )}`
        );
      }

      const port = connections.getPort(connectionId);
      const currentFeatures = await api.readEnabledFeatures(port);
      await api.writeEnabledFeatures(
        port,
        currentFeatures
          .filter((feature) => !RECEIVER_MODES.includes(feature))
          .concat(mode ? [mode] : [])
      );

      return null;
    },
    deviceSetReceiverSerialPort: async (
      _,
      { connectionId, port },
      { connections, api }
    ) => {
      const connectionPort = connections.getPort(connectionId);
      const serialConfig = await api.readSerialConfig(connectionPort);

      await api.writeSerialConfig(connectionPort, {
        ...serialConfig,
        ports: serialConfig.ports.map((portConfig) => ({
          ...portConfig,
          functions: portConfig.functions
            .filter((fun) => fun !== SerialPortFunctions.RX_SERIAL)
            .concat(
              portConfig.id === port ? [SerialPortFunctions.RX_SERIAL] : []
            ),
        })),
      });

      return null;
    },
  },
};

export default { resolvers, typeDefs };
