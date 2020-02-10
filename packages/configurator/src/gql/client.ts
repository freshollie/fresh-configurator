import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ports, isOpen, open, getAttitude } from "@fresh/msp";
import { Resolvers } from "./__generated__";

const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    FlightController: {
      fields: {
        connected: (_, { variables }) => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          return !!connections()?.[variables?.port];
        }
      }
    },
    Configurator: {
      fields: {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        port: () => selectedPort(),
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        tab: () => selectedTab(),
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        expertMode: () => expertMode()
      }
    }
  }
});

const selectedPort = cache.makeLocalVar<string>();
const expertMode = cache.makeLocalVar<boolean>(false);
const selectedTab = cache.makeLocalVar<string>();
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
        // disconnect
        setConnection(port, false);
      });

      setConnection(port, true);
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
