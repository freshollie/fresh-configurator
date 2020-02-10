import { useConnectedQuery } from "../gql/__generated__";

export default (port?: string): boolean => {
  const { data: deviceData } = useConnectedQuery({
    variables: {
      port: port || ""
    },
    skip: !port
  });

  return !!deviceData?.device.connected;
};
