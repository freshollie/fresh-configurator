import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    status: Status!
  }

  type Status {
    cycleTime: Int!
    i2cError: Int!
    cpuload: Float!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    status: (_, __, { api, port }) => api.readExtendedStatus(port),
  },
};

export default { resolvers, typeDefs };
