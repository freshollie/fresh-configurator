/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import {
  ApolloLink,
  Observable,
  Operation,
  FetchResult,
  Observer,
} from "@apollo/client/core";
import type { IpcRenderer, IpcRendererEvent } from "electron";
import { print } from "graphql";
import { deserializeError } from "serialize-error";
import { SerializableGraphQLRequest } from "../../types";

export type ApolloIpcLinkOptions = {
  channel?: string;
  ipc: IpcRenderer;
};

export default class IpcLink extends ApolloLink {
  private ipc: IpcRenderer;

  private counter = 0;

  private channel = "graphql";

  private observers: Map<string, Observer<FetchResult>> = new Map();

  protected listener = (
    event: IpcRendererEvent,
    id: string,
    type: "data" | "error" | "complete",
    data: FetchResult
  ): void => {
    if (!this.observers.has(id)) {
      return undefined;
    }

    const observer = this.observers.get(id);
    switch (type) {
      case "data":
        return observer?.next?.(data);

      case "error": {
        this.observers.delete(id);
        return observer?.error?.(deserializeError(data));
      }

      case "complete": {
        this.observers.delete(id);
        return observer?.complete?.();
      }
    }

    // Makes eslint happy
    return undefined;
  };

  constructor(
    options: ApolloIpcLinkOptions,
    private persistedQueries?: Record<string, string>
  ) {
    super();

    this.ipc = options.ipc;
    if (typeof options.channel !== "undefined") {
      this.channel = options.channel;
    }

    this.ipc.on(this.channel, this.listener);
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable<FetchResult>((observer) => {
      this.counter += 1;
      const current = `${this.counter}`;
      const request: SerializableGraphQLRequest = {
        operationName: operation.operationName,
        variables: operation.variables,
        query:
          this.persistedQueries?.[operation.operationName] ??
          print(operation.query),
      };

      this.observers.set(current, observer);
      this.ipc.send(this.channel, current, request);
    });
  }

  public dispose(): void {
    this.ipc.removeListener(this.channel, this.listener);
  }
}
