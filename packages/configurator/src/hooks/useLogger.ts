import { useLogMutation } from "../gql/mutations/Configurator.graphql";

export default (): ((message: string) => void) => {
  const [log] = useLogMutation();

  return (message) =>
    log({
      variables: {
        message,
      },
    });
};
