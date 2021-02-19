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
    serial: (_, __, { api, port }) => api.readSerialConfig(port),
  },
  Mutation: {
    deviceSetSerialFunctions: async (
      _,
      { connectionId, portFunctions },
      { api, connections }
    ) => {
      const connectionPort = connections.getPort(connectionId);
      const serialConfig = await api.readSerialConfig(connectionPort);

      await api.writeSerialConfig(connectionPort, {
        ...serialConfig,
        ports: serialConfig.ports.map((portConfig) => ({
          ...portConfig,
          functions:
            portFunctions.find(({ id }) => id === portConfig.id)?.functions ??
            portConfig.functions,
        })),
      });

      return null;
    },
  },
};

export default { resolvers, typeDefs };
