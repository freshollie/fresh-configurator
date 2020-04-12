import { Resolvers } from "../../__generated__";

const resolvers: Resolvers = {
  FlightController: {
    attitude: ({ port }, _, { msp }) =>
      msp.readAttitude(port).then((values) => ({
        ...values,
        __typename: "Attitude",
      })),
  },
};

export default resolvers;
