import React from "react";
import semver from "semver";
import Model from "../components/Model";
import useSelectedPort from "../hooks/useSelectedPort";
import {
  useRcChannelsQuery,
  useRcSettingsQuery,
  useApiVersionQuery,
} from "../gql/__generated__";
import useSimulatedAttitude from "../hooks/useSimulatedAttitude";

const RcModelViewProvider: React.FC = () => {
  const port = useSelectedPort();
  const { data: rcSettingsData } = useRcSettingsQuery({
    variables: {
      port: port ?? "",
    },
    skip: !port,
  });

  const { data: apiVersionData } = useApiVersionQuery({
    variables: {
      port: port ?? "",
    },
    skip: !port,
  });

  const apiVersion = apiVersionData?.device.apiVersion ?? "0.0.0";

  const { data: channelsData } = useRcChannelsQuery({
    variables: {
      port: port ?? "",
    },
    skip: !port,
    pollInterval: 10,
  });

  const attitude = useSimulatedAttitude(
    channelsData?.device.rc.channels,
    rcSettingsData?.device.rc.tuning,
    rcSettingsData?.device.rc.deadband,
    semver.lte(apiVersion, "1.20.0")
  );

  return <Model name="quadx" attitude={attitude} rawAttitude />;
};

export default RcModelViewProvider;
