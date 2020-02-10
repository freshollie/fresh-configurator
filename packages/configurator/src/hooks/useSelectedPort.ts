import { useSelectedPortQuery } from "../gql/__generated__";

export default (): string | undefined => {
  const { data: configuratorData } = useSelectedPortQuery();
  return configuratorData?.configurator.port || undefined;
};
