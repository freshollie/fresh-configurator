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
    key: Int!
    src: Int!
    precision: Int!
    time: Int!
  }

  type OSDAlarm {
    key: Int!
    value: Int!
  }

  type OSDWarning {
    key: Int!
    enabled: Boolean!
  }

  type OSDPosition {
    x: Int!
    y: Int!
  }

  type OSDDisplayItem {
    key: Int!
    position: OSDPosition!
    visibilityProfiles: [Boolean!]!
  }

  type OSDStatisticItem {
    key: Int!
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

const resolvers: Resolvers = {
  FlightController: {
    osd: (_, __, { api, port }) => api.readOSDConfig(port),
  },
};

export default {
  typeDefs,
  resolvers,
};
