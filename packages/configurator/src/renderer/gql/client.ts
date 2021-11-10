import {
  InMemoryCache,
  ApolloClient,
  ApolloLink,
  gql as schemaTypes,
  NormalizedCacheObject,
} from "@apollo/client";
import { Resolvers } from "./__generated__/schema";
import introspection from "./__generated__/introspection.json";
import { versionInfo } from "../util";
import IpcLink from "./links/IpcLink";

import { gql } from "./apollo";
import config from "../config";

const typeDefs = schemaTypes`
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

const Logs = gql(/* GraphQL */ `
  query Logs {
    configurator @client {
      logs {
        time
        message
      }
    }
  }
`);

// extract the backend address from the URL search query, as this can
// be dynamically passed to us by electron

export const artifactsAddress =
  config.artifactsFolder ??
  `${
    config.wsBackend?.replace("ws", "http") ?? "http://localhost:9000"
  }/job-artifacts`;

const createRequiredLink = async (): Promise<ApolloLink> => {
  if (window.ipcRenderer) {
    return new IpcLink({ ipc: window.ipcRenderer });
  }

  if (config.wsBackend) {
    const { default: WebSocketLink } = await import("./links/WebSocketLink");
    return new WebSocketLink({
      url: `${config.wsBackend}/graphql`,
      keepAlive: 99999999999,
    });
  }

  const [
    { createSchemaLink },
    { schema, mockedDeviceContext, context, startMockDevice },
    { initialiseSerialBackend },
    { default: WSABinding },
  ] = await Promise.all([
    import("../../shared/SchemaLink"),
    import("@betaflight/api-graph"),
    import("@betaflight/api"),
    import("serialport-binding-webserialapi"),
  ]);

  if (config.isMocked) {
    startMockDevice();
  }

  await initialiseSerialBackend(WSABinding);

  return createSchemaLink({
    schema,
    context: (config.isMocked ? mockedDeviceContext : context)({
      artifactsDir: "/",
    }),
  });
};

export const createClient = async (): Promise<
  ApolloClient<NormalizedCacheObject>
> => {
  const cache = (): InMemoryCache =>
    new InMemoryCache({
      typePolicies: Object.fromEntries(
        // eslint-disable-next-line no-underscore-dangle
        introspection.__schema.types
          .filter(({ kind }) => kind === "OBJECT")
          .map(({ name }) => [name, { merge: true }])
      ),
    });

  const resolvers = (): Resolvers => ({
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
  });

  const client = new ApolloClient({
    cache: cache(),
    typeDefs,
    resolvers: resolvers() as never,
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
      await createRequiredLink(),
    ]),
  });

  const writeInitial = (): void => {
    const { os, version, chromeVersion } = versionInfo();
    client.writeQuery({
      query: gql(/* GraphQL */ `
        query InitWrite {
          configurator {
            logs {
              time
              message
            }
          }
        }
      `),
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

  return client;
};
