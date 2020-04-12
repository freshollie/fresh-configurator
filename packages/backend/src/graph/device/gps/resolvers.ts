import { Resolvers } from "../../__generated__";

const resolvers: Resolvers = {
  FlightController: {
    gps: ({ port }, _, { msp }) =>
      msp.readRawGPS(port).then((gpsData) => ({
        ...gpsData,
        __typename: "GpsData",
      })),
  },
};

export default resolvers;
