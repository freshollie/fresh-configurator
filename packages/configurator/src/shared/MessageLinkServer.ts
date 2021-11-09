import {
  ApolloLink,
  FetchResult,
  execute as executeLink,
} from "@apollo/client/core";
import { serializeError } from "serialize-error";
import { GraphqlMessageTypes, SerializableGraphQLRequest } from "./types";

// eslint-disable-next-line import/prefer-default-export
export const createMessageLinkHandler = (
  link: ApolloLink
): {
  onMessage: (params: {
    request: SerializableGraphQLRequest;
    onResponse: (type: GraphqlMessageTypes, data?: FetchResult) => void;
  }) => void;
} => ({
  onMessage: ({ request, onResponse }) => {
    const result = executeLink(link, request);

    result.subscribe(
      (data) => onResponse("data", data),
      (error) => onResponse("error", serializeError(error)),
      () => onResponse("complete")
    );
  },
});
