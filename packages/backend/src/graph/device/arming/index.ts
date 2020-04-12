import gql from "graphql-tag";
import { Resolvers } from "../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    arming: Arming!
  }

  type Arming {
    disabledFlags: [Int!]!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    arming: ({ port }, _, { msp }) =>
      msp.readExtendedStatus(port).then(({ armingDisabledFlags }) => ({
        __typename: "Arming",
        disabledFlags: armingDisabledFlags,
      })),
  },
};

export default {
  typeDefs,
  resolvers,
};
