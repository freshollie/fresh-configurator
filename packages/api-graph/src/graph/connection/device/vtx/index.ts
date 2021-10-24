import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    vtx: VtxConfig!
  }

  type VtxConfig {
    type: Int!
    band: Int!
    channel: Int!
    power: Int!
    pitMode: Boolean!
    frequency: Int!
    deviceReady: Boolean!
    lowPowerDisarm: Int!
    pitModeFrequency: Int!
    table: VtxTableConfig
  }

  type VtxTableConfig {
    maxChannels: Int!
    numPowerLevels: Int!
    powerLevels: [PowerLevelsRow!]!
    powerLevel(id: Int!): PowerLevelsRow
    numBands: Int!
    bands: [BandsRow!]!
    band(id: Int!): BandsRow
  }

  type PowerLevelsRow {
    id: Int!
    value: Int!
    label: String!
  }

  type BandsRow {
    id: Int!
    name: String!
    letter: String!
    isFactoryBand: Boolean!
    frequencies: [Int!]!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    vtx: (_, __, { api, port }) =>
      api.readVtxConfig(port).then((config) => ({
        ...config,
        table: config.table.available
          ? {
              ...config.table,
              powerLevels: [],
              bands: [],
              powerLevel: null,
              band: null,
            }
          : null,
      })),
  },

  VtxTableConfig: {
    powerLevels: ({ numPowerLevels }, _, { api, port }) =>
      Promise.all(
        new Array(numPowerLevels)
          .fill(1)
          .map((__, index) =>
            api
              .readVtxTablePowerLevelsRow(port, index)
              .then((row) => ({ ...row, id: row.rowNumber }))
          )
      ),
    powerLevel: (_, { id }, { api, port }) =>
      api
        .readVtxTablePowerLevelsRow(port, id)
        .then((row) => ({ ...row, id: row.rowNumber })),
    bands: ({ numBands }, _, { api, port }) =>
      Promise.all(
        new Array(numBands)
          .fill(1)
          .map((__, index) =>
            api
              .readVtxTableBandsRow(port, index + 1)
              .then((row) => ({ ...row, id: row.rowNumber }))
          )
      ),
    band: (_, { id }, { api, port }) =>
      api
        .readVtxTableBandsRow(port, id)
        .then((row) => ({ ...row, id: row.rowNumber })),
  },
};

export default { typeDefs, resolvers };
