import { ApolloServer } from "apollo-server";
import graph from "./graph";
import context from "./context";

const server = new ApolloServer({
  // types are wrong for this, schema should be allowed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: (graph as unknown) as any,
  context,
  formatError: (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    return error;
  },
});

export default server;
