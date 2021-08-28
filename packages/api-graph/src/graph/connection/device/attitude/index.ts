import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    attitude: Attitude!
  }

  type Attitude {
    roll: Float!
    pitch: Float!
    yaw: Float!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    attitude: (_, __, { api, port }) => api.readAttitude(port),
  },
};

export default { resolvers, typeDefs };
