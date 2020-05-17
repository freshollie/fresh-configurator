import { ApolloServer } from "apollo-server";
import { makeExecutableSchema } from "graphql-tools";
import context, { mockedContext } from "./context";
import graph from "./graph";
import { startTicks } from "./mock/api";

// eslint-disable-next-line import/prefer-default-export
export const createServer = ({
  mocked,
  playground,
}: { mocked?: boolean; playground?: boolean } = {}): ApolloServer => {
  if (mocked) {
    startTicks();
  }

  return new ApolloServer({
    schema: makeExecutableSchema(graph),
    context: mocked ? mockedContext : context,
    playground,
    formatError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      return error;
    },
  });
};
