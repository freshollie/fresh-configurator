import React from "react";
import { AttitudeDocument } from "../gql/queries/Device.graphql";
import ModelView from "../components/ModelView";
import useConnectionState from "../hooks/useConnectionState";
import { useQuery } from "../gql/apollo";

type Props = {
  refreshRate: number;
};

const ModelViewProvider: React.FC<Props> = ({ refreshRate }) => {
  const { connection } = useConnectionState();

  const { data: attitudeData } = useQuery(AttitudeDocument, {
    variables: {
      connection: connection ?? "",
    },
    pollInterval: 1000 / refreshRate,
    skip: !connection,
  });

  return (
    <ModelView
      modelType="quadx"
      attitude={attitudeData?.connection.device.attitude ?? undefined}
    />
  );
};

export default ModelViewProvider;
