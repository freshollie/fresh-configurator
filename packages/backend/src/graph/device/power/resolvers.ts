import { Resolvers } from "../../__generated__";

const resolvers: Resolvers = {
  FlightController: {
    power: ({ port }, _, { msp }) =>
      msp.readAnalogValues(port).then((values) => ({
        ...values,
        __typename: "Power",
      })),
  },
};

export default resolvers;
