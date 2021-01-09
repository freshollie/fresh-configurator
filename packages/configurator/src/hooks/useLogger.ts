import { useCallback } from "react";
import { useMutation } from "../gql/apollo";
import { LogDocument } from "../gql/mutations/Configurator.graphql";

export default (): ((message: string) => void) => {
  const [log] = useMutation(LogDocument);

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
