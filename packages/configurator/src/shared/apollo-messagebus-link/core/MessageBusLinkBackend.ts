import {
  ApolloLink,
  FetchResult,
  execute as executeLink,
} from "@apollo/client/core";
import { serializeError } from "serialize-error";
import {
  DefaultInitArgs,
  GraphqlMessageResponse,
  GraphqlMessageType,
  MessageBusLinkRequestTypes,
  MessageBusLinkResponseTypes,
  SerializableGraphQLRequest,
} from "../types";

type MessageLinkHandler = {
  onMessage: (params: {
    request: SerializableGraphQLRequest;
    onResponse: (type: GraphqlMessageType, data?: FetchResult) => void;
  }) => void;
};

const createMessageBusLinkHandler = (link: ApolloLink): MessageLinkHandler => ({
  onMessage: ({ request, onResponse }) => {
    const result = executeLink(link, request);

    result.subscribe(
      (data) => onResponse("data", data),
      (error) => onResponse("error", serializeError(error)),
      () => onResponse("complete")
    );
  },
});

export type RegisterBusFunction<A = DefaultInitArgs> = (
  onRequest: (
    request: MessageBusLinkRequestTypes<A>,
    onResponse: (response: MessageBusLinkResponseTypes) => void
  ) => Promise<void>
) => void;

export type MessageBusBackend<A = DefaultInitArgs> = {
  initialise: (args: A) => Promise<void>;
  listen: () => void;
};

// eslint-disable-next-line import/prefer-default-export
export const createMessageBusLinkBackend = <A = DefaultInitArgs>(options: {
  registerBus: RegisterBusFunction<A>;
  createExecutor: (args: A) => Promise<ApolloLink> | ApolloLink;
}): MessageBusBackend<A> => {
  let messageHandler: MessageLinkHandler | undefined;

  const initialise = async (args: A): Promise<void> => {
    messageHandler = createMessageBusLinkHandler(
      await options.createExecutor(args)
    );
  };

  return {
    initialise,
    listen: () => {
      options.registerBus(async (request, respond) => {
        if (request.type === "init") {
          await initialise(request.args);
          respond({ type: "ready" });
          return;
        }

        messageHandler?.onMessage({
          request: request.args.request,
          onResponse: (type, data) => {
            const response: GraphqlMessageResponse = {
              id: request.args.id,
              type,
              data,
            };
            respond({ type: "response", args: response });
          },
        });
      });
    },
  };
};
