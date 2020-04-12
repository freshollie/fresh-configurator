import React from "react";
import { useAttitudeQuery } from "../gql/__generated__";
import ModelView from "../components/ModelView";
import useConnectionId from "../hooks/useConnectionId";

const ModelViewProvider: React.FC = () => {
  const connectionId = useConnectionId();

  const { data: attitudeData } = useAttitudeQuery({
    variables: {
      connection: connectionId ?? "",
    },
    pollInterval: 5,
    skip: !connectionId,
  });

  return (
    <ModelView
      modelType="quadx"
      attitude={attitudeData?.device.attitude ?? undefined}
    />
  );
};

export default ModelViewProvider;
