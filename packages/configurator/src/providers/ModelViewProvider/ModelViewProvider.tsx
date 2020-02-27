import React from "react";
import {
  useAttitudeQuery,
  useSelectedPortQuery
} from "../../gql/__generated__";
import ModelView from "../../components/ModelView";

const ModelViewProvider: React.FC = () => {
  const { data: configuratorData } = useSelectedPortQuery();
  const port = configuratorData?.configurator?.port;

  const { data: attitudeData } = useAttitudeQuery({
    variables: {
      port: port || ""
    },
    pollInterval: 10,
    skip: !port
  });

  if (attitudeData) {
    return <ModelView name="quadx" attitude={attitudeData.device.attitude} />;
  }
  return null;
};

export default ModelViewProvider;
