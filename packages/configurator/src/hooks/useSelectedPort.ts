import { useConnectionSettingsQuery } from "../gql/__generated__";

export default (): string | undefined => {
  const { data: portsData } = useConnectionSettingsQuery();
  return portsData?.configurator.port ?? undefined;
};
