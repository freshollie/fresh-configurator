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
      connectionId: String!
      displayItem: OSDDisplayItemInput!
    ): Boolean
    deviceSetOSDProfile(connectionId: String!, profileId: Int!): Boolean
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
`;

const keysToIds = <K extends number, T extends { key: K }>(
  items: T[]
): (T & { id: K })[] =>
  items.map((item) => ({
    ...item,
    id: item.key,
  }));

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
      { connectionId, profileId },
      { api, connections }
    ) => {
      const port = connections.getPort(connectionId);
      await api.writeOSDSelectedProfile(port, profileId);

      return null;
    },
    deviceSetOSDDisplayItem: async (
      _,
      { connectionId, displayItem },
      { api, connections }
    ) => {
      const port = connections.getPort(connectionId);
      await api.writeOSDDisplayItem(port, {
        key: displayItem.id,
        ...displayItem,
      });

      return null;
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
