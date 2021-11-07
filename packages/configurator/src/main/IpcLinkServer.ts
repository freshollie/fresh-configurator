import {
  ApolloLink,
  FetchResult,
  Observable,
  execute as executeLink,
} from "@apollo/client/core";
import { serializeError } from "serialize-error";
import type { IpcMain, IpcMainEvent } from "electron";
import { SerializableGraphQLRequest } from "../shared/types";

type IpcExecutorOptions = {
  link: ApolloLink;
  ipc: IpcMain;
  channel?: string;
};

// eslint-disable-next-line import/prefer-default-export
export const createIpcExecutor = (
  options: IpcExecutorOptions
): (() => void) => {
  const channel = options.channel ?? "graphql";
  const listener = (
    event: IpcMainEvent,
    id: number,
    request: SerializableGraphQLRequest
  ): void => {
    const result: Observable<FetchResult> = executeLink(options.link, request);

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
