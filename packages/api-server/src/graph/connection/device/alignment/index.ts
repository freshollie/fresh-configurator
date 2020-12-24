import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    alignment: Alignment!
  }

  extend type Mutation {
    deviceSetBoardAlignment(
      connectionId: ID!
      alignment: AlignmentInput!
    ): Boolean
  }

  input AlignmentInput {
    roll: Float!
    pitch: Float!
    yaw: Float!
  }

  type Alignment {
    roll: Float!
    pitch: Float!
    yaw: Float!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    alignment: ({ port }, _, { api }) => api.readBoardAlignmentConfig(port),
  },
  Mutation: {
    deviceSetBoardAlignment: (
      _,
      { connectionId, alignment },
      { api, connections }
    ) =>
      api
        .writeBoardAlignmentConfig(connections.getPort(connectionId), alignment)
        .then(() => null),
  },
};

export default {
  typeDefs,
  resolvers,
};
