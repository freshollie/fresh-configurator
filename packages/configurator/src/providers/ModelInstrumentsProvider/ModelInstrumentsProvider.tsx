import React from "react";
import Attitude from "../../flightindicators/Attitude";
import Heading from "../../flightindicators/Heading";
import {
  useConnectionSettingsQuery,
  useAttitudeQuery
} from "../../gql/__generated__";

const ModelInstrumentsProvider: React.FC = () => {
  const { data: portsData } = useConnectionSettingsQuery();
  const port = portsData?.configurator.port;
  const { data: deviceData } = useAttitudeQuery({
    variables: {
      port: port ?? ""
    },
    skip: !port,
    pollInterval: 5
  });

  const { roll = 0, pitch = 0, heading = 0 } =
    deviceData?.device?.attitude ?? {};

  return (
    <>
      <Attitude roll={roll} pitch={pitch} />
      <Heading heading={heading} />
    </>
  );
};

export default ModelInstrumentsProvider;
