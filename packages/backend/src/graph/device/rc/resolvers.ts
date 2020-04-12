import { Resolvers } from "../../__generated__";

const resolvers: Resolvers = {
  FlightController: {
    rc: ({ port }) => ({
      port,
      __typename: "RC",
    }),
  },

  RC: {
    channels: ({ port }, _, { msp }) => msp.readRcValues(port),
    tuning: ({ port }, _, { msp }) =>
      msp.readRCTuning(port).then((values) => ({
        ...values,
        __typename: "RCTuning",
      })),
    deadband: ({ port }, _, { msp }) =>
      msp.readRCDeadband(port).then((values) => ({
        ...values,
        __typename: "RCDeadband",
      })),
    rssi: ({ port }, _, { msp }) =>
      msp.readAnalogValues(port).then(({ rssi }) => rssi),
  },
};

export default resolvers;
