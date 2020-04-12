import { ApolloServer } from "apollo-server";
import graph from "./graph";

export default new ApolloServer({
  // types are wrong for this, schema should be allowed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: (graph as unknown) as any,
});
