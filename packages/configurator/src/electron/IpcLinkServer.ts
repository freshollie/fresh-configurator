import { createAsyncIterator, forAwaitEach, isAsyncIterable } from "iterall";
import {
  ApolloLink,
  FetchResult,
  Observable,
  execute as executeLink,
} from "@apollo/client/core";
import { getMainDefinition } from "@apollo/client/utilities";
import {
  parse,
  execute,
  subscribe,
  ExecutionArgs,
  DocumentNode,
  ExecutionResult,
  GraphQLSchema
} from "graphql";
import { serializeError } from "serialize-error";
import type { IpcMain, IpcMainEvent } from "electron";
import { SerializableGraphQLRequest } from "../types";

type SchemaLinkOptions<TContext = unknown, TRoot = unknown> = {
  schema: GraphQLSchema;
  root?: TRoot;
  context: () => TContext;
};

type IpcExecutorOptions = {
  link: ApolloLink;
  ipc: IpcMain;
  channel?: string;
  persistedQueries: Record<string, string>;
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

/**
 * Create a schema link which supports subscriptions
 */
export const createSchemaLink = (options: SchemaLinkOptions): ApolloLink =>
  new ApolloLink(
    (request) =>
      new Observable((observer) => {
        (async () => {
          try {
            // const validationErrors = validate(options.schema, request.query);
            //   if (validationErrors.length > 0) {
            //     return { errors: validationErrors };
            //   }
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
            const iterable = (ensureIterable(
              result
            ) as unknown) as AsyncIterable<FetchResult>;
            await forAwaitEach(iterable, (value) => observer.next(value));
            observer.complete();
          } catch (error) {
            console.error('Error processing query', request, error)
            observer.error(error);
          }
        })();
      })
  );

export const createIpcExecutor = (
  options: IpcExecutorOptions
): (() => void) => {
  const channel = options.channel ?? "graphql";
  const listener = (
    event: IpcMainEvent,
    id: number,
    request: SerializableGraphQLRequest
  ): void => {
    const result: Observable<FetchResult> = executeLink(options.link, {
      ...request,
      query: parse(options.persistedQueries[request.query] ?? request.query),
    });

    const sendIpc = (
      type: "data" | "error" | "complete",
      data?: FetchResult
    ): void => {
      if (!event.sender.isDestroyed()) {
        event.sender.send(channel, id, type, data);
      }
    };

    result.subscribe(
      (data) => sendIpc("data", data),
      (error) => sendIpc("error", serializeError(error)),
      () => sendIpc("complete")
    );
  };

  options.ipc.on(channel, listener);

  return () => {
    options.ipc.removeListener(channel, listener);
  };
};
