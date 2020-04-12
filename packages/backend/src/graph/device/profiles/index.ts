import gql from "graphql-tag";
import { Resolvers } from "../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    profiles: Profiles!
  }

  type Profiles {
    length: Int!
    selected: Int!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    profiles: ({ port }, _, { msp }) =>
      msp.readExtendedStatus(port).then(({ profile, numProfiles }) => ({
        __typename: "Profiles",
        selected: profile,
        length: numProfiles,
      })),
  },
};

export default { resolvers, typeDefs };
