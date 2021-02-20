import React from "react";
import ModelView from "../components/ModelView";
import useConnectionState from "../hooks/useConnectionState";
import { gql, useQuery } from "../gql/apollo";

type Props = {
  refreshRate: number;
};

const ModelViewProvider: React.FC<Props> = ({ refreshRate }) => {
  const { connection } = useConnectionState();

  const { data: attitudeData } = useQuery(
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
      import("./__generated__/ModelViewProvider").AttitudeQuery,
      import("./__generated__/ModelViewProvider").AttitudeQueryVariables
    >,
    {
      variables: {
        connection: connection ?? "",
      },
      pollInterval: 1000 / refreshRate,
      skip: !connection,
    }
  );

  return (
    <ModelView
      modelType="quadx"
      attitude={attitudeData?.connection.device.attitude ?? undefined}
    />
  );
};

export default ModelViewProvider;
