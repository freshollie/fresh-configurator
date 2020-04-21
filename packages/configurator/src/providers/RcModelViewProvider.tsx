import React from "react";
import semver from "semver";
import Model from "../components/Model";
import {
  useRcChannelsQuery,
  useRcSettingsQuery,
  useApiVersionQuery,
} from "../gql/queries/Device.graphql";
import useSimulatedAttitude from "../hooks/useSimulatedAttitude";
import useConnectionState from "../hooks/useConnectionState";

const RcModelViewProvider: React.FC<{ refreshRate: number }> = ({
  refreshRate,
}) => {
  const { connection } = useConnectionState();
  const { data: rcSettingsData } = useRcSettingsQuery({
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const { data: apiVersionData } = useApiVersionQuery({
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const apiVersion = apiVersionData?.connection.apiVersion ?? "0.0.0";

  const { data: channelsData } = useRcChannelsQuery({
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
    pollInterval: 1000 / refreshRate,
  });

  const attitude = useSimulatedAttitude(
    channelsData?.connection.device.rc.channels,
    rcSettingsData?.connection.device.rc.tuning,
    rcSettingsData?.connection.device.rc.deadband,
    semver.lte(apiVersion, "1.20.0")
  );

  return <Model name="quadx" attitude={attitude} />;
};

export default RcModelViewProvider;
