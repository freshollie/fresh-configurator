import React from "react";
import Attitude from "../../flightindicators/Attitude";
import Heading from "../../flightindicators/Heading";
import {
  useSelectedPortQuery,
  useAttitudeQuery
} from "../../gql/__generated__";

const ModelInstrumentsProvider: React.FC = () => {
  const { data: portsData } = useSelectedPortQuery();
  const { data: deviceData } = useAttitudeQuery({
    variables: {
      port: portsData?.configurator.port ?? ""
    },
    skip: !portsData?.configurator.port ?? ""
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
