import { ChannelLetter, channelLetters, ChannelMap } from "@betaflight/api";
import { ApolloError } from "apollo-server-express";
import gql from "graphql-tag";
import debug from "debug";
import { Resolvers } from "../../../__generated__";

const log = debug("api-server:rc");

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
    deviceSetChannelMap(connectionId: ID!, channelMap: [ID!]!): Boolean
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
    serialProvider: Int!
    spi: RxSpiConfig!
    channelMap: [ID!]!
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
        channelMap: [],
        ...config,
        serial: { provider: config.serialProvider },
      })),
    smoothing: (_, __, { api, port }) =>
      api.readRxConfig(port).then(({ rcSmoothing }) => rcSmoothing),
  },
  RxConfig: {
    channelMap: (_, __, { api, port }) =>
      api.readRxMap(port).then((ids) => ids.map((id) => id.toString())),
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
    deviceSetChannelMap: async (
      _,
      { connectionId, channelMap },
      { api, connections }
    ) => {
      const availableLetters = channelLetters();
      const correctedMap = channelMap
        .slice(0, 8)
        .map((letter) =>
          availableLetters.includes(letter as ChannelLetter)
            ? letter
            : Number(letter)
        );

      correctedMap.forEach((value, i) => {
        if (Number.isNaN(value)) {
          throw new Error(`Invalid map value: ${channelMap[i]}`);
        }
      });

      if (correctedMap.length < 8) {
        throw new ApolloError("Channel map must be at least 8");
      }

      log(`Writing rxMap ${correctedMap}`);

      await api.writeRxMap(
        connections.getPort(connectionId),
        correctedMap as ChannelMap
      );

      return null;
    },
  },
};

export default { resolvers, typeDefs };
