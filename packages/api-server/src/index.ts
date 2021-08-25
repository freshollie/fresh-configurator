import { ApolloError, ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import debug from "debug";
import express from "express";
import http from "http";
import ws from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { execute, GraphQLSchema, parse, subscribe } from "graphql";
import getPort from "get-port";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { startTicks } from "./mock/api";
import graph from "./graph";
import context, { Context, mockedContext } from "./context";

const log = debug("api-server:errors");

type ListenOptions = {
  hostname?: string;
  port?: number;
};

type ServerOptions = {
  mocked?: boolean;
  playground?: boolean;
  persistedQueries?: Record<string, string>;
  artifactsDirectory?: string;
  legacyWsProtocol?: boolean;
};

type Server = {
  schema: GraphQLSchema;
  context: () => Context;
  apolloServer: ApolloServer;
  startMockTicks: () => void;
  rest: express.Express;
  listen: (options: ListenOptions) => Promise<number>;
};

// eslint-disable-next-line import/prefer-default-export
export const createServer = ({
  mocked,
  playground,
  persistedQueries,
  artifactsDirectory = `${__dirname}/artifacts/`,
  legacyWsProtocol = false,
}: ServerOptions = {}): Server => {
  const schema = makeExecutableSchema(graph);

  const persistedQueriesStore = persistedQueries
    ? Object.fromEntries(
        Object.entries(persistedQueries).map(([id, query]) => [
          id,
          parse(query),
        ])
      )
    : undefined;

  const app = express();
  const server = http.createServer(app);

  app.use("/job-artifacts", express.static(artifactsDirectory));

  const contextGenerator = mocked
    ? mockedContext({ artifactsDir: artifactsDirectory })
    : context({ artifactsDir: artifactsDirectory });

  const legacyWsServer = legacyWsProtocol
    ? SubscriptionServer.create(
        {
          schema,
          execute,
          subscribe,
        },
        {
          server,
          path: "/graphql",
        }
      )
    : undefined;

  const apolloServer = new ApolloServer({
    schema,
    context: contextGenerator,
    formatError: (error) => {
      log(error);
      return error;
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              legacyWsServer?.close();
            },
          };
        },
      },
    ],
  });

  const wsServer = !legacyWsProtocol
    ? new ws.Server({
        server,
        path: "/graphql",
      })
    : undefined;

  if (wsServer) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useServer(
      {
        context: contextGenerator,
        onSubscribe: persistedQueriesStore
          ? (_ctx, msg) => {
              const document = persistedQueriesStore[msg.payload.query];
              if (!document) {
                // for extra security you only allow the queries from the store
                throw new ApolloError("404: Query Not Found");
              }
              return {
                document,
                schema,
                variableValues: msg.payload.variables,
              };
            }
          : undefined,
        schema,
        execute: async (args) => {
          const result = await execute(args);
          result.errors
            ?.filter(
              (e) =>
                !e.message.includes("not open") &&
                !e.message.includes("is not active")
            )
            .forEach((error) => log(error));
          return result;
        },
        subscribe,
      },
      wsServer
    );
  }
  return {
    schema,
    context: contextGenerator,
    startMockTicks: startTicks,
    apolloServer,
    rest: app,
    listen: async ({ port, hostname }) => {
      const listeningPort =
        port ?? (await getPort({ port: 9000, host: hostname }));

      await apolloServer.start();
      apolloServer.applyMiddleware({ app });
      return new Promise((resolve, reject) => {
        try {
          server.listen(listeningPort, hostname, () => {
            if (mocked) {
              startTicks();
            }

            resolve(listeningPort);
          });
        } catch (e) {
          reject(e);
        }
      });
    },
  };
};
