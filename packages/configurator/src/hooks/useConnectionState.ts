import { useConnectionStateQuery } from "../gql/__generated__";

export default (
  port?: string
): {
  connected: boolean;
  connecting: boolean;
} => {
  const { data: deviceData } = useConnectionStateQuery({
    variables: {
      port: port || ""
    },
    skip: !port
  });

  console.log(deviceData);

  return deviceData?.device ?? { connected: false, connecting: false };
};
