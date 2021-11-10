/* eslint-disable no-restricted-globals */
import {
  context,
  mockedDeviceContext,
  schema,
  startMockDevice,
} from "@betaflight/api-graph";
import { initialiseSerialBackend } from "@betaflight/api";
import WSABinding from "serialport-binding-webserialapi";
import {
  GraphqlMessageRequest,
  GraphqlMessageResponse,
} from "../../../shared/types";
import { createMessageLinkHandler } from "../../../shared/MessageLinkServer";
import { createSchemaExecutor } from "../../../shared/SchemaExecutor";

let messageHandler: ReturnType<typeof createMessageLinkHandler> | undefined;

const createExecutor = async (mocked: boolean): Promise<void> => {
  if (mocked) {
    startMockDevice();
  }

  await initialiseSerialBackend(WSABinding);

  const executor = createSchemaExecutor({
    schema,
    context: (mocked ? mockedDeviceContext : context)({
      artifactsDir: "/",
    }),
  });
  messageHandler = createMessageLinkHandler(executor);
};

self.onmessage = async (
  event: MessageEvent<GraphqlMessageRequest | { type: "init"; mocked: boolean }>
) => {
  const { data: message } = event;
  if ("type" in message) {
    console.log("Initialising", message.mocked);
    await createExecutor(message.mocked);
    self.postMessage("ready");
    return;
  }

  console.log(event);

  messageHandler?.onMessage({
    request: message.request,
    onResponse: (type, data) => {
      const response: GraphqlMessageResponse = { id: message.id, type, data };
      self.postMessage(response);
    },
  });
};
