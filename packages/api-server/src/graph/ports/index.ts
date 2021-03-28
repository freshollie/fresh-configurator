import gql from "graphql-tag";
import { Resolvers } from "../__generated__";

const typeDefs = gql`
  extend type Query {
    ports: [Port!]!
    port(id: String!): Port
  }

  type Port {
    id: String!
    connecting: Boolean!
    connectionId: String
    manufacturer: String
    serialNumber: String
    pnpId: String
    locationId: String
    productId: String
    vendorId: String
  }
`;

const resolvers: Resolvers = {
  Query: {
    ports: (_, __, { api }) =>
      api.ports().then((ports) =>
        ports.map((port) => ({
          ...port,
          id: port.path,
          connectionId: null,
          connecting: false,
        }))
      ),
    port: (_, { id }, { api }) =>
      api.ports().then((ports) => {
        const port = ports.find((p) => p.path === id);
        return port
          ? {
              ...port,
              id: port.path,
              connectionId: null,
              connecting: false,
            }
          : null;
      }),
  },

  Port: {
    connectionId: (port, _, { connections }) =>
      connections.forPort(port.id) ?? null,
    connecting: (port, _, { connections }) => connections.isConnecting(port.id),
  },
};

export default { resolvers, typeDefs };
