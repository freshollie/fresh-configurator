import React from "react";
import semver from "semver";
import Model from "../components/Model";
import {
  useRcChannelsQuery,
  useRcSettingsQuery,
  useApiVersionQuery,
} from "../gql/__generated__";
import useSimulatedAttitude from "../hooks/useSimulatedAttitude";
import useConnectionState from "../hooks/useConnectionState";

const RcModelViewProvider: React.FC = () => {
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

  const apiVersion = apiVersionData?.device.apiVersion ?? "0.0.0";

  const { data: channelsData } = useRcChannelsQuery({
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
    pollInterval: 10,
  });

  const attitude = useSimulatedAttitude(
    channelsData?.device.rc.channels,
    rcSettingsData?.device.rc.tuning,
    rcSettingsData?.device.rc.deadband,
    semver.lte(apiVersion, "1.20.0")
  );

  return <Model name="quadx" attitude={attitude} />;
};

export default RcModelViewProvider;
