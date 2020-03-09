import React from "react";
import {
  useConnectionSettingsQuery,
  useConnectionStateQuery
} from "../gql/__generated__";

const FcStatusProvider: React.FC = () => {
  const { data: connectionData } = useConnectionSettingsQuery();
  const port = connectionData?.configurator.port ?? undefined;
  const baudRate = connectionData?.configurator.baudRate;

  const { data: deviceData } = useConnectionStateQuery({
    variables: {
      port: port || ""
    },
    skip: !port
  });

  return deviceData?.device ?? { connected: false, connecting: false };
};

export default FcStatusProvider;
