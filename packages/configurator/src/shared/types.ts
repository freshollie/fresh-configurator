import { FetchResult } from "@apollo/client/link/core";
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

export type GraphqlMessageType = "data" | "error" | "complete";
export type GraphqlMessageRequest = {
  id: string;
  request: SerializableGraphQLRequest;
};

export type GraphqlMessageResponse = {
  id: string;
  type: GraphqlMessageType;
  data?: FetchResult;
};
