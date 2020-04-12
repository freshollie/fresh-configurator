import gql from "graphql-tag";
import { Resolvers } from "../../__generated__";

const typeDefs = gql`
  extend type FlightController {
    gps: GpsData!
  }

  type GpsData {
    fix: Boolean!
    numSat: Int!
    lat: Int!
    lon: Int!
    alt: Int!
    speed: Int!
    groundCourse: Int!
  }
`;

const resolvers: Resolvers = {
  FlightController: {
    gps: ({ port }, _, { msp }) =>
      msp.readRawGPS(port).then((gpsData) => ({
        ...gpsData,
        __typename: "GpsData",
      })),
  },
};

export default { resolvers, typeDefs };
