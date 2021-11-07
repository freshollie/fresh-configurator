import { createAsyncIterator, forAwaitEach, isAsyncIterable } from "iterall";
import { ApolloLink, FetchResult, Observable } from "@apollo/client/core";
import { getMainDefinition } from "@apollo/client/utilities";
import {
  execute,
  subscribe,
  ExecutionArgs,
  DocumentNode,
  ExecutionResult,
  GraphQLSchema,
} from "graphql";

type SchemaLinkOptions<TContext = unknown, TRoot = unknown> = {
  schema: GraphQLSchema;
  root?: TRoot;
  context: () => TContext;
};

const isSubscription = (query: DocumentNode): boolean => {
  const main = getMainDefinition(query);
  return (
    main.kind === "OperationDefinition" && main.operation === "subscription"
  );
};

const ensureIterable = (
  data: ExecutionResult | AsyncIterableIterator<ExecutionResult>
): AsyncIterator<ExecutionResult> => {
  if (isAsyncIterable(data)) {
    return data;
  }

  return createAsyncIterator([data]);
};

// eslint-disable-next-line import/prefer-default-export
export const createSchemaLink = (options: SchemaLinkOptions): ApolloLink =>
  new ApolloLink(
    (request) =>
      new Observable((observer) => {
        (async () => {
          try {
            const context = await options.context();
            const args: ExecutionArgs = {
              schema: options.schema,
              rootValue: options.root,
              contextValue: context,
              variableValues: request.variables,
              operationName: request.operationName,
              document: request.query,
            };

            const result = await (isSubscription(request.query)
              ? subscribe(args)
              : execute(args));
            const iterable = ensureIterable(
              result
            ) as unknown as AsyncIterable<FetchResult>;
            await forAwaitEach(iterable, (value) => observer.next(value));
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        })();
      })
  );
