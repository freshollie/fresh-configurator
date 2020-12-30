import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    arming: Arming!
  }

  extend type Mutation {
    deviceSetArming(
      connectionId: ID!
      armingDisabled: Boolean!
      runawayTakeoffPreventionDisabled: Boolean!
    ): Boolean
  }

  type Arming {
    disabledFlags: [Int!]!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    arming: ({ port }, _, { api }) =>
      api.readExtendedStatus(port).then(({ armingDisabledFlags }) => ({
        disabledFlags: armingDisabledFlags,
      })),
  },
  Mutation: {
    deviceSetArming: (
      _,
      { connectionId, armingDisabled, runawayTakeoffPreventionDisabled },
      { api, connections }
    ) =>
      api
        .writeArming(connections.getPort(connectionId), {
          armingDisabled,
          runawayTakeoffPreventionDisabled,
        })
        .then(() => null),
  },
};

export default {
  typeDefs,
  resolvers,
};
