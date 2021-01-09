import React from "react";
import BoardAligner from "../components/BoardAligner";
import { useMutation, useQuery } from "../gql/apollo";
import { SetBoardAlignmentDocument } from "../gql/mutations/Device.graphql";
import { DeviceBoardAlignmentDocument } from "../gql/queries/Device.graphql";
import useConnectionState from "../hooks/useConnectionState";

const BoardAlignmentManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading } = useQuery(DeviceBoardAlignmentDocument, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const [setAlignment] = useMutation(SetBoardAlignmentDocument, {
    refetchQueries: [
      {
        query: DeviceBoardAlignmentDocument,
        variables: {
          connection,
        },
      },
    ],
  });

  return (
    <div style={{ opacity: loading ? 0.5 : 1 }}>
      <BoardAligner
        alignment={
          data?.connection.device.alignment ?? { roll: 0, pitch: 0, yaw: 0 }
        }
        onChange={(newAlignment) =>
          setAlignment({
            variables: {
              connection: connection ?? "",
              alignment: newAlignment,
            },
          })
        }
      />
    </div>
  );
};

export default BoardAlignmentManager;
