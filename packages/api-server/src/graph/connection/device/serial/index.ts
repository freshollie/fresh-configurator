import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    serial: SerialConfig!
  }

  extend type Mutation {
    deviceSetSerialFunctions(
      connectionId: ID!
      portFunctions: [PortFunctionsInput!]!
    ): Boolean
  }

  type SerialConfig {
    ports: [PortSettings!]!
    legacy: LegacyBaudRates
  }

  input PortFunctionsInput {
    id: Int!
    functions: [Int!]!
  }

  type PortSettings {
    id: Int!
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
  Mutation: {
    deviceSetSerialFunctions: (
      _,
      { connectionId, portFunctions },
      { api, connections }
    ) =>
      api
        .writeSerialFunctions(connections.getPort(connectionId), portFunctions)
        .then(() => null),
  },
};

export default { resolvers, typeDefs };
