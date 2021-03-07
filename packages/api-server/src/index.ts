import { ApolloServer } from "apollo-server-express";
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
  offloadDirectory?: string;
};

type Server = {
  apolloServer: ApolloServer;
  listen: (options: ListenOptions) => Promise<number>;
};

// eslint-disable-next-line import/prefer-default-export
export const createServer = ({
  mocked,
  playground,
  persistedQueries,
  offloadDirectory = `${__dirname}/offloaded/`,
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

  const apolloServer = new ApolloServer({
    schema,
    context: mocked ? mockedContext : context({ offloadDir: offloadDirectory }),
    playground,
    formatError: (error) => {
      log(error);
      return error;
    },
  });

  apolloServer.applyMiddleware({ app });

  const server = http.createServer(app);
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

  return {
    apolloServer,
    listen: async ({ port, hostname }) => {
      const listeningPort =
        port ?? (await getPort({ port: 9000, host: hostname }));
      return new Promise((resolve, reject) => {
        try {
          server.listen(listeningPort, hostname, () => {
            if (mocked) {
              startTicks();
            }

            if (wsServer) {
              useServer(
                {
                  context: mocked
                    ? mockedContext
                    : context({ offloadDir: offloadDirectory }),
                  onSubscribe: persistedQueriesStore
                    ? (_ctx, msg) => {
                        const document =
                          persistedQueriesStore[msg.payload.query];
                        if (!document) {
                          // for extra security you only allow the queries from the store
                          throw new Error("404: Query Not Found");
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
            resolve(listeningPort);
          });
        } catch (e) {
          reject(e);
        }
      });
    },
  };
};
