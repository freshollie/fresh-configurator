import path from "path";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import { makeExecutableSchema } from "graphql-tools";

const typeDefs = mergeTypes(
  fileLoader(path.join(__dirname, "**/schema.graphql")),
  { all: true }
);

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "**/resolvers"), {
    extensions: [".ts", ".js"],
  })
);

export default makeExecutableSchema({ typeDefs, resolvers });
