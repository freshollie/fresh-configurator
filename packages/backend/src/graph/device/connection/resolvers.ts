import { Resolvers } from "../../__generated__";

const resolvers: Resolvers = {
  FlightController: {
    connection: ({ port }) => ({ __typename: "ConnectionStatus", port }),
  },
  ConnectionStatus: {
    bytesRead: ({ port }, _, { msp }) => msp.bytesRead(port),
    bytesWritten: ({ port }, _, { msp }) => msp.bytesWritten(port),
    packetErrors: ({ port }, _, { msp }) => msp.packetErrors(port),
  },
};

export default resolvers;
