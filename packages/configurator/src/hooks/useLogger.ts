import { useLogMutation } from "../gql/__generated__";

export default (): ((message: string) => void) => {
  const [log] = useLogMutation();

  return (message) =>
    log({
      variables: {
        message,
      },
    });
};
