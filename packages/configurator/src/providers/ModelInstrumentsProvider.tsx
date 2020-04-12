import React from "react";
import Attitude from "../flightindicators/Attitude";
import Heading from "../flightindicators/Heading";
import { useAttitudeQuery } from "../gql/__generated__";
import useConnectionId from "../hooks/useConnectionId";

const ModelInstrumentsProvider: React.FC = () => {
  const connectionId = useConnectionId();
  const { data: deviceData } = useAttitudeQuery({
    variables: {
      connection: connectionId ?? "",
    },
    skip: !connectionId,
    pollInterval: 5,
  });

  const { roll = 0, pitch = 0, heading = 0 } =
    deviceData?.device?.attitude ?? {};

  return (
    <>
      <Attitude roll={roll} pitch={pitch} size={90} />
      <Heading heading={heading} size={90} />
    </>
  );
};

export default ModelInstrumentsProvider;
