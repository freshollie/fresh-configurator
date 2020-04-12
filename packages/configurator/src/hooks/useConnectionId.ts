import { useConnectionIdQuery } from "../gql/__generated__";

export default (): string | undefined => {
  const { data } = useConnectionIdQuery();
  return data?.configurator.connection ?? undefined;
};
