import { ApolloError, ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import debug from "debug";
import express from "express";
import http from "http";
import ws from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { execute, parse, subscribe } from "graphql";
import getPort from "get-port";
import { startTicks } from "./mock/api";
import graph from "./graph";
import context, { mockedContext } from "./context";

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
};

type Server = {
  apolloServer: ApolloServer;
  rest: express.Express;
  listen: (options: ListenOptions) => Promise<number>;
};

// eslint-disable-next-line import/prefer-default-export
export const createServer = ({
  mocked,
  playground,
  persistedQueries,
  artifactsDirectory = `${__dirname}/artifacts/`,
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

  const apolloServer = new ApolloServer({
    schema,
    context: mocked
      ? mockedContext
      : context({ artifactsDir: artifactsDirectory }),
    playground,
    formatError: (error) => {
      log(error);
      return error;
    },
  });

  apolloServer.applyMiddleware({ app });

  if (!persistedQueries) {
    apolloServer.installSubscriptionHandlers(server);
  }

  // Use the `graphql-ws` server if we are using persisted queries
  // as it's the only server type which can cope with this
  const wsServer = persistedQueries
    ? new ws.Server({
        server,
        path: "/graphql",
      })
    : undefined;

  if (wsServer) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useServer(
      {
        context: mocked
          ? mockedContext
          : context({ artifactsDir: artifactsDirectory }),
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
    apolloServer,
    rest: app,
    listen: async ({ port, hostname }) => {
      const listeningPort =
        port ?? (await getPort({ port: 9000, host: hostname }));
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
