import { InMemoryCache, ApolloClient, gql, ApolloLink } from "@apollo/client";
import WebSocketLink from "./links/WebSocketLink";
import { Resolvers } from "./__generated__/schema";
import introspection from "./__generated__/introspection.json";
import { versionInfo } from "../util";
import IpcLink from "./links/IpcLink";

// eslint-disable-next-line @betaflight-tools/ts-graphql/gql-type-assertion
const typeDefs = gql`
  type Query {
    configurator: Configurator!
  }

  type Mutation {
    log(message: String!): Boolean
  }

  type Configurator {
    logs: [Log!]!
  }

  type Log {
    time: String!
    message: String!
  }
`;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resolvers = (): any => {
  const config: Resolvers = {
    Query: {
      configurator: () => ({
        __typename: "Configurator",
        logs: [],
      }),
    },
    Mutation: {
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
export const artifactsAddress =
  searchParams.get("artifacts") ??
  `${wsBackend.replace("ws", "http")}/job-artifacts`;

const link = window.ipcRenderer
  ? new IpcLink({ ipc: window.ipcRenderer })
  : new WebSocketLink({
      url: `${wsBackend}/graphql`,
      keepAlive: 99999999999,
    });

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
    link,
  ]),
});

const writeInitial = (): void => {
  const { os, version, chromeVersion } = versionInfo();
  client.writeQuery({
    query: gql`
      query InitWrite {
        configurator {
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
