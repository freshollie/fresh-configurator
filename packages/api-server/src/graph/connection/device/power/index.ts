import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    power: Power!
  }

  type Power {
    voltage: Float!
    mahDrawn: Int!
    amperage: Float!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    power: (_, __, { api, port }) => api.readAnalogValues(port),
  },
};

export default { resolvers, typeDefs };
