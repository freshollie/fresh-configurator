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
  MessageBusLinkRequestTypes,
  DefaultInitArgs,
  MessageBusLinkResponseTypes,
  SerializableGraphQLRequest,
} from "../types";

type LinkArgs<A = DefaultInitArgs> = {
  requestHandler: (message: MessageBusLinkRequestTypes<A>) => void;
  registerResponseHandler: (
    responseHandler: (response: MessageBusLinkResponseTypes) => void
  ) => void;
};

export default class MessengeBusLink<A = DefaultInitArgs> extends ApolloLink {
  private counter = 0;

  private observers: Map<string, Observer<FetchResult>> = new Map();

  private postMessage: LinkArgs<A>["requestHandler"];

  private readyListener?: () => void;

  public onResponse = (message: MessageBusLinkResponseTypes): void => {
    if (message.type === "ready") {
      this.readyListener?.();
      return undefined;
    }

    const { id, type, data } = message.args;
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

  constructor({ registerResponseHandler, requestHandler }: LinkArgs<A>) {
    super();
    this.postMessage = requestHandler;
    registerResponseHandler(this.onResponse);
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
      this.postMessage({ type: "request", args: { id: current, request } });
    });
  }

  /**
   * Initialise the backend with the provided args.
   * Will resolve once the backend has been created,
   * and has responded with ready.
   *
   * This doesn't need to be called if you preinitialise
   * the backend (in electron main for example)
   */
  public async initialiseBackend(args: A): Promise<void> {
    const readyResponse = new Promise<void>((resolve) => {
      this.readyListener = () => {
        this.readyListener = undefined;
        resolve();
      };
    });
    this.postMessage({ type: "init", args });

    await readyResponse;
  }
}
