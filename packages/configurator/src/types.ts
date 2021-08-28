import { DocumentNode } from "graphql";

export type SerializableGraphQLRequest<
  TContext = Record<string, string>,
  TVariables = Record<string, string>,
  TExtensions = Record<string, string>
> = {
  query: DocumentNode;
  operationName?: string;
  variables?: TVariables;
  context?: TContext;
  extensions?: TExtensions;
};
