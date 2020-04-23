import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { Resolvers, Configurator } from "./__generated__";
import { versionInfo } from "../util";
import {
  LogsQueryResult,
  LogsQuery,
  LogsDocument,
} from "./queries/Configurator.graphql";

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

const resolvers: Resolvers = {
  Mutation: {
    setTab: (_, { tabId }, { client }) => {
      client.writeData({
        data: {
          __typename: "Query",
          configurator: {
            __typename: "Configurator",
            tab: tabId,
          } as Configurator,
        },
      });
      return null;
    },
    setConnectionSettings: (_, { port, baudRate }, { client }) => {
      const data: { port: string; baudRate?: number } = {
        port,
      };

      if (typeof baudRate === "number") {
        data.baudRate = baudRate;
      }

      client.writeData({
        data: {
          __typename: "Query",
          configurator: {
            __typename: "Configurator",
            ...data,
          } as Configurator,
        },
      });

      return null;
    },
    setConnecting: (_, { value }, { client }) => {
      client.writeData({
        data: {
          __typename: "Query",
          configurator: {
            __typename: "Configurator",
            connecting: value,
          } as Configurator,
        },
      });

      return null;
    },
    setConnection: (_, { connection }, { client }) => {
      client.writeData({
        data: {
          __typename: "Query",
          configurator: {
            __typename: "Configurator",
            connection,
          } as Configurator,
        },
      });

      return null;
    },
    setExpertMode: (_, { enabled }, { client }) => {
      client.writeData({
        data: {
          __typename: "Query",
          configurator: {
            __typename: "Configurator",
            expertMode: enabled,
          } as Configurator,
        },
      });

      return null;
    },
    log: (_, { message }, { client }) => {
      const logs =
        client.readQuery<LogsQuery, LogsQueryResult>({
          query: LogsDocument,
        })?.configurator.logs ?? [];

      client.writeData({
        data: {
          __typename: "Query",
          configurator: {
            __typename: "Configurator",
            logs: logs.concat([
              {
                time: new Date().toISOString(),
                message,
                __typename: "Log" as const,
              },
            ]),
          } as Configurator,
        },
      });

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

const writeInitial = (): void => {
  const { os, version, chromeVersion } = versionInfo();
  client.writeData({
    data: {
      __typename: "Query",
      configurator: {
        port: null,
        baudRate: 115200,
        tab: null,
        expertMode: false,
        connecting: false,
        connection: null,
        logs: [
          {
            time: new Date().toISOString(),
            message: `Running - OS: <strong>${os}</strong>, Chrome: <strong>${chromeVersion}</strong>, Configurator: <strong>${version}</strong>`,
            __typename: "Log",
          },
        ],
        __typename: "Configurator",
      } as Configurator,
    },
  });
};

writeInitial();
client.onResetStore(() => Promise.resolve(writeInitial()));

export default client;
