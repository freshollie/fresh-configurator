import path from "path";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import { makeExecutableSchema } from "graphql-tools";

export default makeExecutableSchema({
  typeDefs: mergeTypes(fileLoader(path.join(__dirname, "**/schema.graphql")), {
    all: true,
  }),
  resolvers: mergeResolvers(
    fileLoader<never>(path.join(__dirname, "./**/resolvers.{ts,js}"))
  ),
});
