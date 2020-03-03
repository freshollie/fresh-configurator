/* eslint-disable @typescript-eslint/no-use-before-define */
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
import { Resolvers } from "./__generated__";
import config from "../config";

type ConnectionState = "disconnected" | "connecting" | "connected";

const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    FlightController: {
      fields: {
        connected: (_, { variables }) => {
          return connections()[variables?.port] === "connected";
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
const connections = cache.makeLocalVar<Record<string, ConnectionState>>({});

const setConnectionState = (port: string, newState: ConnectionState): void => {
  const currentConnections = connections();
  connections({ ...currentConnections, [port]: newState });
};

const connectionState = (port: string): ConnectionState => connections()[port];

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

      setConnectionState(port, "connecting");

      await open(port, () => {
        // on disconnect
        setConnectionState(port, "disconnected");
      });

      try {
        const mspInfo = await getMspInfo(port);
        if (semver.gte(mspInfo.apiVersion, config.apiVersionAccepted)) {
          setConnectionState(port, "connected");
          return true;
        }
      } catch (e) {
        console.log(e);
      }

      if (connectionState(port) === "connecting") {
        await close(port);
      }

      return false;
    },
    disconnect: async (_, { port }) => {
      if (!isOpen(port)) {
        return true;
      }

      // Closing the port will cause the callback to update the port
      // state to disconnected anyway
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
