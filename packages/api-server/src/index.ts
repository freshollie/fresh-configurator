import { ApolloServer } from "apollo-server";
import { makeExecutableSchema } from "graphql-tools";
import context from "./context";
import graph from "./graph";

const server = new ApolloServer({
  // types are wrong for this, schema should be allowed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: makeExecutableSchema(graph),
  context,
  formatError: (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    return error;
  },
});

export = server;
