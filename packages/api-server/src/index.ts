/* eslint-disable react-hooks/rules-of-hooks */
import { ApolloError, ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import debug from "debug";
import express from "express";
import http from "http";
import ws from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { execute, GraphQLSchema, parse, subscribe } from "graphql";
import getPort from "get-port";
import { GRAPHQL_WS, SubscriptionServer } from "subscriptions-transport-ws";
import { GRAPHQL_TRANSPORT_WS_PROTOCOL } from "graphql-ws";
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

  const contextGenerator = mocked
    ? mockedContext({ artifactsDir: artifactsDirectory })
    : context({ artifactsDir: artifactsDirectory });

  // Create a graphql server which will work with
  // graphql-ws
  const graphqlWsServer = new ws.Server({
    noServer: true,
  });
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
    graphqlWsServer
  );

  // And one which works with legacy protocol (subscriptions-transport-ws) 
  const subscriptionTransportWsServer = new ws.Server({
    noServer: true,
  });
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: () => contextGenerator()
    },
    subscriptionTransportWsServer
  );

  // And create an apollo http server which
  // will handle HTTP traffic
  const apolloServer = new ApolloServer({
    schema,
    context: contextGenerator,
    formatError: (error) => {
      log(error);
      return error;
    },
  });

  // route to the correct graphql server
  // based on the received protocol
  server.on("upgrade", (req, socket, head) => {
    // extract websocket subprotocol from header
    const protocol = req.headers["sec-websocket-protocol"] as string | string[] | undefined;
    const protocols = Array.isArray(protocol)
      ? protocol
      : protocol?.split(",").map((p) => p.trim());

    // decide which websocket server to use
    const wss =
      protocols?.includes(GRAPHQL_WS) && // subscriptions-transport-ws subprotocol
      !protocols.includes(GRAPHQL_TRANSPORT_WS_PROTOCOL) // graphql-ws subprotocol
        ? subscriptionTransportWsServer
        : // graphql-ws will welcome its own subprotocol and
          // gracefully reject invalid ones. if the client supports
          // both transports, graphql-ws will prevail
          graphqlWsServer;
    wss.handleUpgrade(req, socket, head, (s) => {
      wss.emit("connection", s, req);
    });
  });
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
