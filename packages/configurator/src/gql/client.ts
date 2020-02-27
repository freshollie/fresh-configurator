/* eslint-disable @typescript-eslint/no-use-before-define */
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ports, isOpen, open, getAttitude, close } from "@fresh/msp";
import { Resolvers } from "./__generated__";

const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    FlightController: {
      fields: {
        connected: (_, { variables }) => {
          return !!connections()?.[variables?.port];
        }
      }
    },
    Configurator: {
      fields: {
        port: () => selectedPort(),
        tab: () => selectedTab(),
        expertMode: () => expertMode()
      }
    }
  }
});

const selectedPort = cache.makeLocalVar<string | null>(null);
const expertMode = cache.makeLocalVar<boolean>(false);
const selectedTab = cache.makeLocalVar<string | null>(null);
const connections = cache.makeLocalVar<Record<string, boolean>>({});

const setConnection = (port: string, connected: boolean): void => {
  const currentConnections = connections();
  connections({ ...currentConnections, [port]: connected });
};

const resolvers: Resolvers = {
  Query: {
    ports: () => ports(),
    device: (_, { port }) => ({
      port,
      connected: false,
      __typename: "FlightController"
    }),
    configurator: () => ({
      port: selectedPort(),
      tab: selectedTab(),
      expertMode: expertMode(),
      __typename: "Configurator"
    })
  },
  Mutation: {
    connect: async (_, { port }) => {
      if (isOpen(port)) {
        return true;
      }

      await open(port, () => {
        // on disconnect
        setConnection(port, false);
      });

      setConnection(port, true);
      return true;
    },
    disconnect: async (_, { port }) => {
      if (!isOpen(port)) {
        return true;
      }

      await close(port);
      return true;
    },

    selectTab: (_, { tabId }) => !!selectedTab(tabId),
    selectPort: (_, { port }) => !!selectedPort(port),
    setExpertMode: (_, { enabled }) => !!expertMode(enabled)
  },

  FlightController: {
    attitude: ({ port }) =>
      getAttitude(port).then(values => ({ ...values, __typename: "Attitude" }))
  }
};

const client = new ApolloClient({
  cache,
  // generated resolvers are not compatible with apollo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvers: resolvers as any
});

export default client;
