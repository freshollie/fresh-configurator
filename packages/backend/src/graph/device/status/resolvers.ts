import { Resolvers } from "../../__generated__";

const resolvers: Resolvers = {
  FlightController: {
    status: ({ port }, _, { msp }) =>
      msp.readExtendedStatus(port).then((values) => ({
        ...values,
        __typename: "Status",
      })),
  },
};

export default resolvers;
