import React from "react";
import {
  useAttitudeQuery,
  useConnectionSettingsQuery
} from "../../gql/__generated__";
import ModelView from "../../components/ModelView";

const ModelViewProvider: React.FC = () => {
  const { data: configuratorData } = useConnectionSettingsQuery();
  const port = configuratorData?.configurator?.port;

  const { data: attitudeData } = useAttitudeQuery({
    variables: {
      port: port ?? ""
    },
    pollInterval: 5,
    skip: !port
  });

  return (
    <ModelView
      modelType="quadx"
      attitude={attitudeData?.device.attitude ?? undefined}
    />
  );
};

export default ModelViewProvider;
