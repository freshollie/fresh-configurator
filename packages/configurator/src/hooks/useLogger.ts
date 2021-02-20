import { useCallback } from "react";
import { useMutation, gql } from "../gql/apollo";

export default (): ((message: string) => void) => {
  const [log] = useMutation(
    gql`
      mutation Log($message: String!) {
        log(message: $message) @client
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/useLogger").LogMutation,
      import("./__generated__/useLogger").LogMutationVariables
    >
  );

  return useCallback(
    (message) =>
      log({
        variables: {
          message,
        },
      }),
    [log]
  );
};
