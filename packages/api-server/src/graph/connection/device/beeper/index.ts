import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    beeper: BeeperConfig!
  }

  extend type Mutation {
    deviceSetDshotBeeperConfig(
      connectionId: ID!
      config: DshotBeeperConfigInput!
    ): Boolean
  }

  type BeeperConfig {
    conditions: [Int!]!
    dshot: DshotBeeperConfig!
  }

  type DshotBeeperConfig {
    tone: Int!
    conditions: [Int!]!
  }

  input DshotBeeperConfigInput {
    tone: Int!
    conditions: [Int!]!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    beeper: ({ port }, _, { api }) => api.readBeeperConfig(port),
  },
  Mutation: {
    deviceSetDshotBeeperConfig: (
      _,
      { connectionId, config },
      { api, connections }
    ) =>
      api
        .writeDshotBeeperConfig(connections.getPort(connectionId), config)
        .then(() => null),
  },
};

export default { resolvers, typeDefs };
