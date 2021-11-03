import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    osd: OSDConfig!
  }

  type OSDProfileConfig {
    count: Int!
    selected: Int!
  }

  type OSDTimer {
    id: Int!
    src: Int!
    precision: Int!
    time: Int!
  }

  type OSDAlarm {
    id: Int!
    value: Int!
  }

  type OSDWarning {
    id: Int!
    enabled: Boolean!
  }

  type OSDPosition {
    x: Int!
    y: Int!
  }

  type OSDDisplayItem {
    id: Int!
    position: OSDPosition!
    visibilityProfiles: [Boolean!]!
  }

  type OSDStatisticItem {
    id: Int!
    enabled: Boolean!
  }

  type OSDFlags {
    hasOSD: Boolean!
    haveMax7456Video: Boolean!
    haveOsdFeature: Boolean!
    isOsdSlave: Boolean!
    isMax7456Detected: Boolean!
  }

  type OSDParameters {
    cameraFrameWidth: Int!
    cameraFrameHeight: Int!
    overlayRadioMode: Int!
  }

  type OSDConfig {
    flags: OSDFlags!
    unitMode: Int!
    displayItems: [OSDDisplayItem!]!
    statisticItems: [OSDStatisticItem!]!
    warnings: [OSDWarning!]!
    timers: [OSDTimer!]!
    osdProfiles: OSDProfileConfig!
    videoSystem: Int!
    alarms: [OSDAlarm!]!
    parameters: OSDParameters!
  }

  extend type Mutation {
    deviceSetOSDDisplayItem(
      connectionId: ID!
      displayItem: OSDDisplayItemInput!
    ): Boolean
    deviceSetOSDProfile(connectionId: ID!, profileIndex: Int!): Boolean
    deviceSetOSDAlarm(connectionId: ID!, alarm: OSDAlarmInput!): Boolean
    deviceSetOSDWarning(connectionId: ID!, warning: OSDWarningInput!): Boolean
    deviceSetOSDVideoSystem(connectionId: ID!, videoSystem: Int!): Boolean
    deviceSetOSDUnitMode(connectionId: ID!, unitMode: Int!): Boolean
    deviceSetOSDParameters(
      connectionId: ID!
      parameters: OSDParametersInput!
    ): Boolean
    deviceSetOSDTimer(connectionId: ID!, timer: OSDTimerInput!): Boolean
    deviceSetOSDStatisticItem(
      connectionId: ID!
      statisticItem: OSDStatisticItemInput!
    ): Boolean
    deviceSetOSDChar(
      connectionId: ID!
      charIndex: Int!
      charBytesBuffer: [Int!]!
    ): Boolean
  }

  input OSDDisplayItemInput {
    id: Int!
    position: OSDPositionInput!
    visibilityProfiles: [Boolean!]!
  }

  input OSDPositionInput {
    x: Int!
    y: Int!
  }

  input OSDAlarmInput {
    id: Int!
    value: Int!
  }

  input OSDWarningInput {
    id: Int!
    enabled: Boolean!
  }

  input OSDTimerInput {
    id: Int!
    src: Int!
    precision: Int!
    time: Int!
  }

  input OSDParametersInput {
    cameraFrameWidth: Int
    cameraFrameHeight: Int
    overlayRadioMode: Int
  }

  input OSDStatisticItemInput {
    id: Int!
    enabled: Boolean!
  }
`;

const keysToIds = <K extends number, T extends { key: K }>(
  items: T[]
): (T & { id: K })[] =>
  items.map((item) => ({
    ...item,
    id: item.key,
  }));

const idToKey = <I extends number, T extends { id: I }>(
  item: T
): Omit<T, "id"> & { key: I } => {
  const newObject: Omit<T, "id"> & { id?: I; key: I } = {
    ...item,
    key: item.id,
  };

  delete newObject.id;

  return newObject;
};

const resolvers: Resolvers = {
  FlightController: {
    osd: async (_, __, { api, port }) => {
      const config = await api.readOSDConfig(port);

      return {
        ...config,
        displayItems: keysToIds(config.displayItems),
        statisticItems: keysToIds(config.statisticItems),
        alarms: keysToIds(config.alarms),
        timers: keysToIds(config.timers),
        warnings: keysToIds(config.warnings),
      };
    },
  },

  Mutation: {
    deviceSetOSDProfile: async (
      _,
      { connectionId, profileIndex },
      { api, connections }
    ) => {
      const port = connections.getPort(connectionId);
      await api.writeOSDSelectedProfile(port, profileIndex);

      return null;
    },
    deviceSetOSDDisplayItem: async (
      _,
      { connectionId, displayItem },
      { api, connections }
    ) => {
      const port = connections.getPort(connectionId);
      await api.writeOSDDisplayItem(port, idToKey(displayItem));

      return null;
    },
    deviceSetOSDAlarm: async (
      _,
      { connectionId, alarm },
      { api, connections }
    ) => {
      const port = connections.getPort(connectionId);
      await api.writeOSDAlarm(port, idToKey(alarm));

      return null;
    },
    deviceSetOSDWarning: async (
      _,
      { connectionId, warning },
      { api, connections }
    ) => {
      const port = connections.getPort(connectionId);
      await api.writeOSDWarning(port, idToKey(warning));

      return null;
    },
    deviceSetOSDTimer: async (
      _,
      { connectionId, timer },
      { api, connections }
    ) => {
      const port = connections.getPort(connectionId);
      await api.writeOSDTimer(port, idToKey(timer));

      return null;
    },
    deviceSetOSDVideoSystem: async (
      _,
      { connectionId, videoSystem },
      { api, connections }
    ) => {
      const port = connections.getPort(connectionId);
      await api.writeOSDVideoSystem(port, videoSystem);

      return null;
    },
    deviceSetOSDParameters: async (
      _,
      { connectionId, parameters },
      { api, connections }
    ) => {
      const port = connections.getPort(connectionId);
      await api.writePartialOSDParameters(port, parameters);
      return null;
    },
    deviceSetOSDUnitMode: async (
      _,
      { connectionId, unitMode },
      { api, connections }
    ) => {
      const port = connections.getPort(connectionId);
      await api.writeOSDUnitMode(port, unitMode);
      return null;
    },
    deviceSetOSDStatisticItem: async (
      _,
      { connectionId, statisticItem },
      { api, connections }
    ) => {
      const port = connections.getPort(connectionId);
      await api.writeOSDStatisticItem(port, idToKey(statisticItem));
      return null;
    },
    deviceSetOSDChar: async (
      _,
      { connectionId, charIndex, charBytesBuffer },
      { api, connections }
    ) => {
      const port = connections.getPort(connectionId);
      await api.writeOSDChar(port, charIndex, Buffer.from(charBytesBuffer));
      return null;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
