import { ApolloClient, InMemoryCache } from "@apollo/client";
import gql from "graphql-tag";
import { WebSocketLink } from "@apollo/link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { Resolvers } from "./__generated__";
import { versionInfo } from "../util";

const typeDefs = gql`
  type Query {
    configurator: Configurator!
  }

  type Mutation {
    setConnectionSettings(port: String!, baudRate: Int): Boolean
    setConnection(connection: ID): Boolean
    setConnecting(value: Boolean!): Boolean
    setTab(tabId: String!): Boolean
    setExpertMode(enabled: Boolean!): Boolean
    log(message: String!): Boolean
  }

  type Configurator {
    port: String
    connection: ID
    connecting: Boolean!
    baudRate: Int!
    tab: String
    expertMode: Boolean!
    logs: [Log!]!
  }

  type Log {
    time: String!
    message: String!
  }
`;

const cache = new InMemoryCache();

const selectedTab = cache.makeVar<string | null>(null);
const selectedBaudrate = cache.makeVar(115200);
const selectedPort = cache.makeVar<string | null>(null);
const expertMode = cache.makeVar(false);

const { os, version, chromeVersion } = versionInfo();

const logs = cache.makeVar([
  {
    time: new Date().toISOString(),
    message: `Running - OS: <strong>${os}</strong>, Chrome: <strong>${chromeVersion}</strong>, Configurator: <strong>${version}</strong>`,
  },
]);

const connecting = cache.makeVar(false);
const connectionId = cache.makeVar<string | null>(null);

cache.policies.addTypePolicies({
  Query: {
    fields: {
      connection: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
    },
  },
  Connection: {
    fields: {
      device: {
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
    },
  },
  Configurator: {
    fields: {
      port: {
        read: () => selectedPort(),
      },
      tab: {
        read: () => selectedTab(),
      },
      connecting: {
        read: () => connecting(),
      },
      connection: {
        read: () => connectionId(),
      },
      logs: {
        read: () => logs().map((log) => ({ ...log, __typename: "Log" })),
      },
    },
  },
});

const resolvers: Resolvers = {
  Query: {
    configurator: () => {
      return {
        id: "0",
        __typename: "Configurator",
        port: selectedPort(),
        baudRate: selectedBaudrate(),
        tab: selectedTab(),
        expertMode: false,
        connecting: connecting(),
        connection: connectionId(),
        logs: logs().map((log) => ({ ...log, __typename: "Log" })),
      };
    },
  },
  Mutation: {
    setTab: (_, { tabId }) => {
      selectedTab(tabId);
      return null;
    },
    setConnectionSettings: (_, { port, baudRate }) => {
      if (typeof baudRate === "number") {
        selectedBaudrate(baudRate);
      }
      selectedPort(port);

      return null;
    },
    setConnecting: (_, { value }) => {
      connecting(value);
      return null;
    },
    setConnection: (_, { connection }) => {
      connectionId(connection);

      return null;
    },
    setExpertMode: (_, { enabled }) => {
      expertMode(enabled);

      return null;
    },
    log: (_, { message }) => {
      logs(
        logs().concat([
          {
            time: new Date().toISOString(),
            message,
          },
        ])
      );

      return null;
    },
  },
};

// extract the backend address from the URL search query, as this can
// be dynamically passed to us by electron
const searchParams = new URLSearchParams(window.location.search.slice(1));
const BACKEND = searchParams.get("backend") ?? "ws://localhost:9000";

const subscriptionClient = new SubscriptionClient(`${BACKEND}/graphql`, {
  reconnect: true,
});

const client = new ApolloClient({
  cache,
  typeDefs,
  // generated resolvers are not compatible with apollo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvers: resolvers as any,
  link: new WebSocketLink(subscriptionClient),
});

export default client;
