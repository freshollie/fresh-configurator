/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import {
  ApolloLink,
  Observable,
  Operation,
  FetchResult,
  Observer,
} from "@apollo/client/core";
import { deserializeError } from "serialize-error";
import {
  GraphqlMessageRequest,
  GraphqlMessageResponse,
  SerializableGraphQLRequest,
} from "../../../shared/types";

export default class MessengerLink extends ApolloLink {
  private counter = 0;

  private observers: Map<string, Observer<FetchResult>> = new Map();

  protected listener = ({ id, type, data }: GraphqlMessageResponse): void => {
    if (!this.observers.has(id)) {
      return undefined;
    }

    const observer = this.observers.get(id);
    switch (type) {
      case "data":
        // Data should exist if the type is data
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return observer?.next?.(data!);

      case "error": {
        this.observers.delete(id);
        return observer?.error?.(deserializeError(data));
      }

      case "complete": {
        this.observers.delete(id);
        return observer?.complete?.();
      }
    }

    return undefined;
  };

  constructor(private postMessage: (message: GraphqlMessageRequest) => void) {
    super();
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable<FetchResult>((observer) => {
      this.counter += 1;
      const current = `${this.counter}`;
      const request: SerializableGraphQLRequest = {
        operationName: operation.operationName,
        variables: operation.variables,
        query: operation.query,
      };

      this.observers.set(current, observer);
      this.postMessage({ id: current, request });
    });
  }
}
