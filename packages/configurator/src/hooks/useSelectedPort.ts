import { useConnectionSettingsQuery } from "../gql/queries/Configurator.graphql";

export default (): string | undefined => {
  const { data: portsData } = useConnectionSettingsQuery();
  return portsData?.configurator.port ?? undefined;
};
