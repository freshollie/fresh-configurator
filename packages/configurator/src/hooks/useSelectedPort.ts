import { useSelectedPortQuery } from "../gql/__generated__";

export default (): string | undefined => {
  const { data: portsData } = useSelectedPortQuery();
  return portsData?.port || undefined;
};
