import { ApolloLink } from "@apollo/client/core";
import type { IpcMain, IpcMainEvent } from "electron";
import { GraphqlMessageRequest, GraphqlMessageResponse } from "../shared/types";
import { createMessageLinkHandler } from "../shared/MessageLinkServer";

type IpcExecutorOptions = {
  link: ApolloLink;
  ipc: IpcMain;
  channel?: string;
};

// eslint-disable-next-line import/prefer-default-export
export const createIpcLinkServer = (
  options: IpcExecutorOptions
): (() => void) => {
  const channel = options.channel ?? "graphql";
  const { onMessage } = createMessageLinkHandler(options.link);
  const listener = (
    event: IpcMainEvent,
    { id, request }: GraphqlMessageRequest
  ): void => {
    onMessage({
      request,
      onResponse: (type, data) => {
        if (!event.sender.isDestroyed()) {
          const response: GraphqlMessageResponse = { id, type, data };
          event.sender.send(channel, response);
        }
      },
    });
  };

  options.ipc.on(channel, listener);

  return () => {
    options.ipc.removeListener(channel, listener);
  };
};
