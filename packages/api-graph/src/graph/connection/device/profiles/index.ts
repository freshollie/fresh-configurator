import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

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
    profiles: (_, __, { api, port }) =>
      api.readExtendedStatus(port).then(({ profile, numProfiles }) => ({
        __typename: "Profiles",
        selected: profile,
        length: numProfiles,
      })),
  },
};

export default { resolvers, typeDefs };
