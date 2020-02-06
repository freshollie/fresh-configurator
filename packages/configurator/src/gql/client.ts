import {
  ApolloClient,
  ApolloContextValue,
  InMemoryCache
} from "@apollo/client";
import { ports, isConnected, open, getAttitude } from "@fresh/msp";
import {
  Resolvers,
  SelectedPortQuery,
  SelectedPortDocument,
  ConnectedDocument,
  ConnectedQuery,
  ConnectedQueryVariables
} from "./__generated__";

const resolvers: Resolvers = {
  Query: {
    ports: () => ports(),
    device: (_, { port }) => ({
      port,
      __typename: "FlightController"
    })
  },
  Mutation: {
    connect: async (_, { port }, { client }: ApolloContextValue) => {
      if (isConnected(port)) {
        return true;
      }

      await open(port, () => {
        // disconnect
        client?.writeQuery<ConnectedQuery, ConnectedQueryVariables>({
          query: ConnectedDocument,
          data: {
            device: {
              connected: false,
              __typename: "FlightController"
            },
            __typename: "Query"
          },
          variables: {
            port
          }
        });
      });

      client?.writeQuery<ConnectedQuery, ConnectedQueryVariables>({
        query: ConnectedDocument,
        data: {
          device: {
            connected: true,
            __typename: "FlightController"
          },
          __typename: "Query"
        },
        variables: {
          port
        }
      });

      return true;
    },
    selectPort: (_, { port }, { client }: ApolloContextValue) =>
      !!client?.writeQuery<SelectedPortQuery>({
        query: SelectedPortDocument,
        data: {
          port,
          __typename: "Query"
        }
      })
  },

  FlightController: {
    attitude: ({ port }) =>
      getAttitude(port).then(values => ({ ...values, __typename: "Attitude" })),
    connected: ({ port }) => isConnected(port)
  }
};

const client = new ApolloClient({
  cache: new InMemoryCache(),
  resolvers: resolvers as any
});

export default client;
