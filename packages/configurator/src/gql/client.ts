import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  ports,
  isOpen,
  open,
  getAttitude,
  close,
  getMspInfo
} from "@fresh/msp";
import semver from "semver";
import {
  Resolvers,
  ConnectionStateQueryVariables,
  ConnectionStateDocument,
  ConnectionStateQuery
} from "./__generated__";
import config from "../config";

interface Context {
  client: ApolloClient<object>;
}

const cache = new InMemoryCache();

const selectedPort = cache.makeVar<string | null>(null);
// default baudrate
const selectedBaud = cache.makeVar<number>(115200);

const expertMode = cache.makeVar<boolean>(false);
const selectedTab = cache.makeVar<string | null>(null);

cache.policies.addTypePolicies({
  Configurator: {
    fields: {
      port: () => selectedPort(),
      baudRate: () => selectedBaud(),
      tab: () => selectedTab(),
      expertMode: () => expertMode()
    }
  }
});

const setConnectionState = (
  client: ApolloClient<object>,
  port: string,
  connecting: boolean,
  connected: boolean
): void =>
  client.writeQuery<ConnectionStateQuery, ConnectionStateQueryVariables>({
    query: ConnectionStateDocument,
    data: {
      __typename: "Query",
      device: {
        connected,
        connecting,
        __typename: "FlightController"
      }
    },
    variables: {
      port
    }
  });

const resolvers: Resolvers = {
  Query: {
    ports: () => ports(),
    device: (_, { port }) => ({
      port,
      connected: false,
      connecting: false,
      __typename: "FlightController"
    }),
    configurator: () => ({
      port: selectedPort(),
      baudRate: selectedBaud(),
      tab: selectedTab(),
      expertMode: expertMode(),
      __typename: "Configurator"
    })
  },
  Mutation: {
    connect: async (_, { port, baudRate }, { client }: Context) => {
      if (isOpen(port)) {
        return true;
      }

      setConnectionState(client, port, true, false);

      await open(port, { baudRate }, () => {
        // on disconnect
        setConnectionState(client, port, false, false);
      });

      try {
        const mspInfo = await getMspInfo(port);
        if (semver.gte(mspInfo.apiVersion, config.apiVersionAccepted)) {
          setConnectionState(client, port, false, true);
          return true;
        }
      } catch (e) {
        console.log(e);
      }

      // read the current connection state from memory
      const { data } = await client.query<
        ConnectionStateQuery,
        ConnectionStateQueryVariables
      >({
        query: ConnectionStateDocument,
        variables: {
          port
        }
      });

      // And only close the port if we are connecting
      if (data.device.connecting) {
        await close(port);
      }

      return false;
    },
    disconnect: async (_, { port }, { client }: Context) => {
      if (!isOpen(port)) {
        return true;
      }

      await close(port);
      setConnectionState(client, port, false, false);

      return true;
    },

    setTab: (_, { tabId }) => !!selectedTab(tabId),
    setConnectionSettings: (_, { port, baudRate }) => {
      selectedPort(port);
      if (typeof baudRate === "number") {
        selectedBaud(baudRate);
      }
      return true;
    },
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
