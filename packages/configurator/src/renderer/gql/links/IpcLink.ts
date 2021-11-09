/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import type { IpcRenderer } from "electron";
import { IpcRendererEvent } from "electron/main";
import { GraphqlMessageResponse } from "../../../shared/types";
import MessengerLink from "./MessengerLink";

export type ApolloIpcLinkOptions = {
  channel?: string;
  ipc: IpcRenderer;
};

export default class IpcLink extends MessengerLink {
  private ipc: IpcRenderer;

  private channel = "graphql";

  constructor(options: ApolloIpcLinkOptions) {
    super((message) => this.ipc.send(this.channel, message));

    this.ipc = options.ipc;
    if (typeof options.channel !== "undefined") {
      this.channel = options.channel;
    }

    this.ipc.on(this.channel, (_, response) => this.listener(response));
  }

  private onResponse = (
    event: IpcRendererEvent,
    message: GraphqlMessageResponse
  ): void => {
    this.listener(message);
  };

  public dispose(): void {
    this.ipc.removeListener(this.channel, this.listener);
  }
}
