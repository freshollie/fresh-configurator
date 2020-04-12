import { Resolvers } from "../../__generated__";

const resolvers: Resolvers = {
  FlightController: {
    info: ({ port }, _, { msp }) =>
      msp.readBoardInfo(port).then((values) => ({
        ...values,
        __typename: "BoardInfo",
      })),
  },
};

export default resolvers;
