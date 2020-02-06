import { useConnectedQuery } from "../gql/__generated__";

export default (port?: string): boolean => {
  const { data: connectedData } = useConnectedQuery({
    variables: {
      port: port || ""
    },
    skip: !port
  });

  return !!connectedData?.device.connected;
};
