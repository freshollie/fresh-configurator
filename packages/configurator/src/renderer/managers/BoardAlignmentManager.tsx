import React from "react";
import { Box } from "bumbag";
import BoardAligner from "../components/BoardAligner";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const BoadAlignment = gql(/* GraphQL */ `
  query DeviceBoardAlignment($connection: ID!) {
    connection(connectionId: $connection) {
      device {
        alignment {
          roll
          pitch
          yaw
        }
      }
    }
  }
`);

const BoardAlignmentManager: React.FC = () => {
  const connection = useConnection();
  const { data, loading } = useQuery(BoadAlignment, {
    variables: {
      connection,
    },
  });

  const [setAlignment] = useMutation(
    gql(/* GraphQL */ `
      mutation SetBoardAlignment(
        $connection: ID!
        $alignment: AlignmentInput!
      ) {
        deviceSetBoardAlignment(
          connectionId: $connection
          alignment: $alignment
        )
      }
    `),
    {
      refetchQueries: [
        {
          query: BoadAlignment,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  return (
    <Box opacity={loading ? 0.5 : 1}>
      <BoardAligner
        alignment={
          data?.connection.device.alignment ?? { roll: 0, pitch: 0, yaw: 0 }
        }
        onChange={(newAlignment) =>
          setAlignment({
            variables: {
              connection,
              alignment: newAlignment,
            },
          })
        }
      />
    </Box>
  );
};

export default BoardAlignmentManager;
