import { InMemoryCache, ApolloClient, gql } from "@apollo/client";
import WebSocketLink from "./WebSocketLink";
import { Resolvers, Configurator } from "./__generated__";
import introspection from "./__generated__/introspection.json";
import { versionInfo } from "../util";
import {
  LogsDocument,
  SelectedTabDocument,
  ConnectionSettingsDocument,
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

export const cache = (): InMemoryCache =>
  new InMemoryCache({
    typePolicies: Object.fromEntries(
      // eslint-disable-next-line no-underscore-dangle
      introspection.__schema.types
        .filter(({ kind }) => kind === "OBJECT")
        .map(({ name }) => [name, { merge: true }])
    ),
  });

export const resolvers = (initialState?: {
  connecting?: boolean;
  connection?: string | null;
  port?: string;
  baudRate?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): any => {
  const config: Resolvers = {
    Query: {
      configurator: () => ({
        __typename: "Configurator",

        port: "",
        baudRate: 115200,
        connecting: false,
        connection: null,
        expertMode: false,
        logs: [],
        ...initialState,
      }),
    },
    Mutation: {
      setTab: (_, { tabId }, { client }) => {
        client.writeQuery({
          query: SelectedTabDocument,
          data: {
            __typename: "Query",
            configurator: {
              __typename: "Configurator",
              tab: tabId,
            },
          },
        });
        return null;
      },
      setConnectionSettings: (_, { port, baudRate }, { client }) => {
        const existingData = {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...client.readQuery({
            query: ConnectionSettingsDocument,
          })!.configurator,
        };

        if (typeof baudRate === "number") {
          existingData.baudRate = baudRate;
        }
        existingData.port = port;

        client.writeQuery({
          query: ConnectionSettingsDocument,
          data: {
            __typename: "Query",
            configurator: {
              ...existingData,
            },
          },
        });

        return null;
      },
      setConnecting: (_, { value }, { client }) => {
        client.writeQuery({
          query: gql`
            query {
              configurator {
                connecting
              }
            }
          `,
          data: {
            __typename: "Query",
            configurator: {
              __typename: "Configurator",
              connecting: value,
            },
          },
        });

        return null;
      },
      setConnection: (_, { connection }, { client }) => {
        client.writeQuery({
          query: gql`
            query {
              configurator {
                connection
              }
            }
          `,
          data: {
            __typename: "Query",
            configurator: {
              __typename: "Configurator",
              connection,
            },
          },
        });

        return null;
      },
      // setExpertMode: (_, { enabled }, { client }) => {
      //   client.writeQuery({
      //     document: Ex,
      //     data: {
      //       __typename: "Query",
      //       configurator: {
      //         __typename: "Configurator",
      //         expertMode: enabled,
      //       } as Configurator,
      //     },
      //   });

      //   return null;
      // },
      log: (_, { message }, { client }) => {
        const logs =
          client.readQuery({
            query: LogsDocument,
          })?.configurator.logs ?? [];

        client.writeQuery({
          query: LogsDocument,
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
            },
          },
        });

        return null;
      },
    },
  };
  return config;
};

// extract the backend address from the URL search query, as this can
// be dynamically passed to us by electron
const searchParams = new URLSearchParams(window.location.search.slice(1));
const BACKEND = searchParams.get("backend") ?? "ws://localhost:9000";

const client = new ApolloClient({
  cache: cache(),
  typeDefs,
  resolvers: resolvers(),
  link: new WebSocketLink({
    url: `${BACKEND}/graphql`,
    keepAlive: 99999999999,
  }),
});

const writeInitial = (): void => {
  const { os, version, chromeVersion } = versionInfo();
  client.writeQuery({
    query: gql`
      query {
        configurator {
          port
          baudRate
          tab
          expertMode
          connecting
          connection
          logs {
            time
            message
          }
        }
      }
    `,
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
