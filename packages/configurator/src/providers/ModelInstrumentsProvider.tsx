import React from "react";
import Attitude from "../flightindicators/Attitude";
import Heading from "../flightindicators/Heading";
import { gql, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

type Props = {
  refreshRate: number;
};

const ModelInstrumentsProvider: React.FC<Props> = ({ refreshRate }) => {
  const connection = useConnection();
  const { data: deviceData } = useQuery(
    gql`
      query Attitude($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            attitude {
              roll
              pitch
              yaw
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ModelInstrumentsProvider").AttitudeQuery,
      import("./__generated__/ModelInstrumentsProvider").AttitudeQueryVariables
    >,
    {
      variables: {
        connection,
      },
      pollInterval: 1000 / refreshRate,
    }
  );

  const { roll = 0, pitch = 0, yaw = 0 } =
    deviceData?.connection.device.attitude ?? {};

  return (
    <>
      <Attitude roll={roll} pitch={pitch} size={90} />
      <Heading heading={yaw} size={90} />
    </>
  );
};

export default ModelInstrumentsProvider;
