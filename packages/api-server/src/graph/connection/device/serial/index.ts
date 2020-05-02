import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    serial: SerialConfig!
  }

  type SerialConfig {
    ports: [PortSettings!]!
    legacy: LegacyBaudRates
  }

  type PortSettings {
    identifier: Int
    functions: [Int!]!
    mspBaudRate: Int!
    gpsBaudRate: Int!
    telemetryBaudRate: Int!
    blackboxBaudRate: Int!
  }

  type LegacyBaudRates {
    mspBaudRate: Int!
    cliBaudRate: Int!
    gpsBaudRate: Int!
    gpsPassthroughBaudRate: Int!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    serial: ({ port }, _, { api }) => api.readSerialConfig(port),
  },
};

export default { resolvers, typeDefs };
