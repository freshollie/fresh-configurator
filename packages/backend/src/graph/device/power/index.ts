import gql from "graphql-tag";
import { Resolvers } from "../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    power: Power!
  }

  type Power {
    voltage: Int!
    mahDrawn: Int!
    amperage: Int!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    power: ({ port }, _, { msp }) =>
      msp.readAnalogValues(port).then((values) => ({
        ...values,
        __typename: "Power",
      })),
  },
};

export default { resolvers, typeDefs };
