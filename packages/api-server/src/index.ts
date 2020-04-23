import { ApolloServer } from "apollo-server";
import { makeExecutableSchema } from "graphql-tools";
import context, { mockedContext } from "./context";
import graph from "./graph";

// eslint-disable-next-line import/prefer-default-export
export const createServer = ({
  mocked,
  playground,
}: { mocked?: boolean; playground?: boolean } = {}): ApolloServer =>
  new ApolloServer({
    // types are wrong for this, schema should be allowed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: makeExecutableSchema(graph),
    context: mocked ? mockedContext : context,
    playground,
    formatError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      return error;
    },
  });
