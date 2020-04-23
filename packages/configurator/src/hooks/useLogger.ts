import { useCallback } from "react";
import { useLogMutation } from "../gql/mutations/Configurator.graphql";

export default (): ((message: string) => void) => {
  const [log] = useLogMutation();

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
