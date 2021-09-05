import { useCallback } from "react";
import { useMutation, gql } from "../gql/apollo";

export default (): ((message: string) => void) => {
  const [log] = useMutation(
    gql(/* GraphQL */ `
      mutation Log($message: String!) {
        log(message: $message) @client
      }
    `)
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
