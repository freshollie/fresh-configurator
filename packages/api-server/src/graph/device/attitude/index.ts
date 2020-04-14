import gql from "graphql-tag";
import { Resolvers } from "../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    attitude: Attitude!
  }

  type Attitude {
    roll: Float!
    pitch: Float!
    heading: Float!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    attitude: ({ port }, _, { msp }) =>
      msp.readAttitude(port).then((values) => ({
        ...values,
        __typename: "Attitude",
      })),
  },
};

export default { resolvers, typeDefs };
