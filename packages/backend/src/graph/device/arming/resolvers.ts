import { Resolvers } from "../../__generated__";

const resolvers: Resolvers = {
  FlightController: {
    arming: ({ port }, _, { msp }) =>
      msp.readExtendedStatus(port).then(({ armingDisabledFlags }) => ({
        __typename: "Arming",
        disabledFlags: armingDisabledFlags,
      })),
  },
};

export default resolvers;
