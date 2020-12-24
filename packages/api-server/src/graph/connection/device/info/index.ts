import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    info: BoardInfo!
  }

  type BoardInfo {
    boardIdentifier: String!
    boardVersion: Int!
    boardType: Int!
    targetCapabilities: Int!
    targetName: String!
    boardName: String!
    manufacturerId: String!
    signature: [Int!]!
    mcuTypeId: Int!
    configurationState: Int
    sampleRateHz: Int
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    info: ({ port }, _, { api }) => api.readBoardInfo(port),
  },
};

export default { resolvers, typeDefs };
