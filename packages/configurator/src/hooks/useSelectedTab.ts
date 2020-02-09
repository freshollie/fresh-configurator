import { useSelectedTabQuery } from "../gql/__generated__";

export default (): string | undefined => {
  const { data: configuratorData } = useSelectedTabQuery();
  return configuratorData?.tab || undefined;
};
