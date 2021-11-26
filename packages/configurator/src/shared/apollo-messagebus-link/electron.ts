import type { IpcMain, IpcRenderer } from "electron";
import MessageBusLink from "./core/MessageBusLink";
import { RegisterBusFunction } from "./core/MessageBusLinkBackend";
import { DefaultInitArgs } from "./types";

export const electronBus =
  <A = DefaultInitArgs>(
    ipc: IpcMain,
    channel = "graphql"
  ): RegisterBusFunction<A> =>
  (request) =>
    ipc.on(channel, (event, message) =>
      request(message, (response) => {
        if (!event.sender.isDestroyed()) {
          event.sender.send(channel, response);
        }
      })
    );

export const createElectronMessageBusLink = <A = DefaultInitArgs>(
  ipc: IpcRenderer,
  channel = "graphql"
): MessageBusLink<A> =>
  new MessageBusLink({
    requestHandler: (request) => {
      ipc.send(channel, request);
    },
    registerResponseHandler: (handler) => {
      ipc.on(channel, (_, response) => handler(response));
    },
  });
