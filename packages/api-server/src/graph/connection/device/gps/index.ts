import gql from "graphql-tag";
import { Resolvers } from "../../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    gps: GpsData!
  }

  type GpsData {
    fix: Boolean!
    numSat: Int!
    lat: Float!
    lon: Float!
    alt: Float!
    speed: Float!
    groundCourse: Float!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    gps: ({ port }, _, { api }) => api.readRawGPS(port),
  },
};

export default { resolvers, typeDefs };
