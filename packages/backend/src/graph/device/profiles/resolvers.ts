import { Resolvers } from "../../__generated__";

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

export default resolvers;
