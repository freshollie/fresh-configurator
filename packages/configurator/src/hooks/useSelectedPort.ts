import { useQuery } from "../gql/apollo";
import { ConnectionSettingsDocument } from "../gql/queries/Configurator.graphql";

export default (): string | undefined => {
  const { data: portsData } = useQuery(ConnectionSettingsDocument);
  return portsData?.configurator.port ?? undefined;
};
