import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    modes: Modes!
  }

  extend type Mutation {
    deviceSetModeSlotConfig(
      connectionId: ID!
      slotId: Int!
      config: ModeSlotConfig!
    ): Boolean
  }

  type Modes {
    available: [Int!]!
    slots: [ModeSlot!]!
    # used to update cache
    slot(id: Int!): ModeSlot
  }

  type ModeSlot {
    id: Int!
    modeId: Int!
    auxChannel: Int!
    range: ModeActivationRange!
    modeLogic: Int
    linkedTo: Int
  }

  input ModeSlotConfig {
    modeId: Int!
    auxChannel: Int!
    range: ModeActivationRangeInput!
    modeLogic: Int
    linkedTo: Int
  }

  type ModeActivationRange {
    start: Int!
    end: Int!
  }

  input ModeActivationRangeInput {
    start: Int!
    end: Int!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    modes: () => ({} as never),
  },

  Modes: {
    available: (_, __, { api, port }) => api.readBoxIds(port),
    slots: (_, __, { api, port }) =>
      api.readModeRangeSlots(port).then((slots) =>
        slots.map((slot, index) => ({
          ...slot,
          id: index,
          modeLogic: slot.modeLogic ?? null,
          linkedTo: slot.linkedTo ?? null,
        }))
      ),
    slot: (_, { id }, { api, port }) =>
      api
        .readModeRangeSlots(port)
        .then((slots) => slots[id])
        .then((slot) =>
          slot
            ? {
                ...slot,
                id,
                modeLogic: slot.modeLogic ?? null,
                linkedTo: slot.linkedTo ?? null,
              }
            : null
        ),
  },

  Mutation: {
    deviceSetModeSlotConfig: (
      _,
      { connectionId, slotId, config },
      { api, connections }
    ) =>
      api
        .writeModeRangeSlot(connections.getPort(connectionId), slotId, {
          ...config,
          modeLogic: config.modeLogic ?? undefined,
          linkedTo: config.linkedTo ?? undefined,
        })
        .then(() => null),
  },
};

export default {
  typeDefs,
  resolvers,
};
