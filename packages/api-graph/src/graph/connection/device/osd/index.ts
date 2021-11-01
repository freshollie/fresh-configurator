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
    timerSources: [Int!]!
    osdProfiles: OSDProfileConfig!
    videoSystem: Int!
    alarms: [OSDAlarm!]!
    parameters: OSDParameters!
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
    osd: async (_, __, { api, port }) =>
      api.readOSDConfig(port).then((config) => ({
        ...config,
        displayItems: keysToIds(config.displayItems),
        statisticItems: keysToIds(config.statisticItems),
        alarms: keysToIds(config.alarms),
        timers: keysToIds(config.timers),
        warnings: keysToIds(config.warnings),
      })),
  },
};

export default {
  typeDefs,
  resolvers,
};
