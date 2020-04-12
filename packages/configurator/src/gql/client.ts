import { ApolloClient, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import gql from "graphql-tag";
import {
  Resolvers,
  LogsQuery,
  LogsQueryVariables,
  LogsDocument,
} from "./__generated__";
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

interface Context {
  client: ApolloClient<object>;
}

const cache = new InMemoryCache();

const selectedPort = cache.makeVar<string | null>(null);
// default baudrate
const selectedBaud = cache.makeVar<number>(115200);

const expertMode = cache.makeVar<boolean>(false);
const selectedTab = cache.makeVar<string | null>(null);
const connecting = cache.makeVar<boolean>(false);
const connectionId = cache.makeVar<string | null>(null);

cache.policies.addTypePolicies({
  Configurator: {
    fields: {
      port: () => selectedPort(),
      baudRate: () => selectedBaud(),
      tab: () => selectedTab(),
      expertMode: () => expertMode(),
      connecting: () => connecting(),
      connection: () => connectionId(),
    },
  },
});

const log = (client: ApolloClient<object>, message: string): void => {
  const data = client.readQuery<LogsQuery, LogsQueryVariables>({
    query: LogsDocument,
  });

  client.writeQuery<LogsQuery, LogsQueryVariables>({
    query: LogsDocument,
    data: {
      configurator: {
        logs: [
          ...(data?.configurator.logs ?? []).concat({
            time: new Date().toISOString(),
            message,
            __typename: "Log" as const,
          }),
        ],
        __typename: "Configurator",
      },
      __typename: "Query",
    },
  });
};

const resolvers: Resolvers = {
  Query: {
    configurator: () => {
      const { os, version, chromeVersion } = versionInfo();
      return {
        port: selectedPort(),
        baudRate: selectedBaud(),
        tab: selectedTab(),
        expertMode: expertMode(),
        connecting: connecting(),
        connection: connectionId(),
        logs: [
          {
            time: new Date().toISOString(),
            message: `Running - OS: <strong>${os}</strong>, Chrome: <strong>${chromeVersion}</strong>, Configurator: <strong>${version}</strong>`,
            __typename: "Log",
          },
        ],
        __typename: "Configurator",
      };
    },
  },
  Mutation: {
    setTab: (_, { tabId }) => !!selectedTab(tabId),
    setConnectionSettings: (_, { port, baudRate }) => {
      selectedPort(port);
      if (typeof baudRate === "number") {
        selectedBaud(baudRate);
      }
      return true;
    },
    setConnecting: (_, { value }) => connecting(value),
    setConnection: (_, { connection }) => {
      connectionId(connection ?? null);
      return null;
    },
    setExpertMode: (_, { enabled }) => !!expertMode(enabled),
    log: (_, { message }, { client }: Context) => {
      log(client, message);
      return true;
    },
  },
};

const GRAPHQL_ENDPOINT = "ws://localhost:9000/graphql";

const subscriptionClient = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
});

const client = new ApolloClient({
  cache,
  typeDefs,
  // generated resolvers are not compatible with apollo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolvers: resolvers as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  link: new WebSocketLink(subscriptionClient) as any,
});

export default client;
