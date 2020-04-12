import React from "react";
import { useAttitudeQuery } from "../gql/__generated__";
import ModelView from "../components/ModelView";
import useConnectionState from "../hooks/useConnectionState";

const ModelViewProvider: React.FC = () => {
  const { connection } = useConnectionState();

  const { data: attitudeData } = useAttitudeQuery({
    variables: {
      connection: connection ?? "",
    },
    pollInterval: 5,
    skip: !connection,
  });

  return (
    <ModelView
      modelType="quadx"
      attitude={attitudeData?.device.attitude ?? undefined}
    />
  );
};

export default ModelViewProvider;
