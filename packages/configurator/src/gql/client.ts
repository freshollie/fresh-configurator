import { InMemoryCache, ApolloClient, gql, ApolloLink } from "@apollo/client";
import WebSocketLink from "./WebSocketLink";
import { Resolvers } from "./__generated__/schema";
import introspection from "./__generated__/introspection.json";
import { versionInfo } from "../util";

// eslint-disable-next-line @betaflight-tools/ts-graphql/gql-type-assertion
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

const ConnectionSettings = gql`
  query ConnectionSettings {
    configurator @client {
      port
      baudRate
    }
  }
` as import("@graphql-typed-document-node/core").TypedDocumentNode<
  import("./__generated__/client").ConnectionSettingsQuery,
  import("./__generated__/client").ConnectionSettingsQueryVariables
>;

const Logs = gql`
  query Logs {
    configurator @client {
      logs {
        time
        message
      }
    }
  }
` as import("@graphql-typed-document-node/core").TypedDocumentNode<
  import("./__generated__/client").LogsQuery,
  import("./__generated__/client").LogsQueryVariables
>;

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
          query: gql`
            query SelectedTab {
              configurator @client {
                tab
              }
            }
          ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
            import("./__generated__/client").SelectedTabQuery,
            import("./__generated__/client").SelectedTabQueryVariables
          >,
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
            query: ConnectionSettings,
          })!.configurator,
        };

        if (typeof baudRate === "number") {
          existingData.baudRate = baudRate;
        }
        existingData.port = port;

        client.writeQuery({
          query: ConnectionSettings,
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
            query ClientConnecting {
              configurator {
                connecting
              }
            }
          ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
            import("./__generated__/client").ClientConnectingQuery,
            import("./__generated__/client").ClientConnectingQueryVariables
          >,
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
            query ClientConnection {
              configurator {
                connection
              }
            }
          ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
            import("./__generated__/client").ClientConnectionQuery,
            import("./__generated__/client").ClientConnectionQueryVariables
          >,
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
            query: Logs,
          })?.configurator.logs ?? [];

        client.writeQuery({
          query: Logs,
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
const wsBackend = searchParams.get("backend") ?? "ws://localhost:9000";
export const artifactsAddress = `${wsBackend.replace(
  "ws",
  "http"
)}/job-artifacts`;

const client = new ApolloClient({
  cache: cache(),
  typeDefs,
  resolvers: resolvers(),
  link: ApolloLink.from([
    // new RetryLink({
    //   // Retry all operations unless retry is explicitly disabled
    //   attempts: (_, operation) => operation.getContext().retry !== false,
    //   delay: {
    //     initial: 10,
    //     max: 5,
    //     jitter: true,
    //   },
    // }),
    // new ApolloLink((operation, forward) =>
    //   forward(operation).map((data) => {
    //     if (data.errors?.[0]) {
    //       console.log("test");
    //       throw new Error(`${data.errors[0].message}`);
    //     }
    //     return data;
    //   })
    // ),
    new WebSocketLink({
      url: `${wsBackend}/graphql`,
      keepAlive: 99999999999,
      lazy: false,
    }),
  ]),
});

const writeInitial = (): void => {
  const { os, version, chromeVersion } = versionInfo();
  client.writeQuery({
    query: gql`
      query InitWrite {
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
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/client").InitWriteQuery,
      import("./__generated__/client").InitWriteQueryVariables
    >,
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
      },
    },
  });
};

writeInitial();
client.onResetStore(() => Promise.resolve(writeInitial()));

export default client;
