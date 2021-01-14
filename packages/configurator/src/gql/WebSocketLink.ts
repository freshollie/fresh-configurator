/* eslint-disable functional/no-class */
/* eslint-disable functional/no-this-expression */
import { ApolloLink, Operation, FetchResult, Observable } from "@apollo/client";
import { print, GraphQLError } from "graphql";
import { createClient, ClientOptions, Client } from "graphql-ws/lib/client";
import persistedQueries from "./__generated__/persisted-queries.json";

const PERSISTED_QUERY_MODE = window.location.search.includes("electron=true");

export default class WebSocketLink extends ApolloLink {
  private client: Client;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe<FetchResult>(
        {
          ...operation,
          // Use the operation name to find the hash of the
          // query and send it, if in persisted queries
          // mode
          query: PERSISTED_QUERY_MODE
            ? (persistedQueries as Record<string, string>)[
                operation.operationName
              ] ?? print(operation.query)
            : print(operation.query),
        },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: (err) => {
            if (err instanceof Error) {
              sink.error(err);
            } else if (err instanceof CloseEvent) {
              sink.error(
                new Error(
                  `Socket closed with event ${err.code}${
                    err.reason
                      ? `: ${err.reason}` // reason will be available on clean closes
                      : ""
                  }`
                )
              );
            } else {
              sink.error(
                new Error(
                  (err as GraphQLError[])
                    .map(({ message }) => message)
                    .join(", ")
                )
              );
            }
          },
        }
      );
    });
  }
}
