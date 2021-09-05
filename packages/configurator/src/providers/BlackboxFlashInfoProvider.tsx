import { Box, Heading, Level, ProgressBar, Text } from "bumbag";
import React from "react";
import { gql, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const BlackboxFlashInfoProvider: React.FC = () => {
  const connection = useConnection();

  const { data, loading } = useQuery(
    gql(/* GraphQL */ `
      query BlackboxFlashInfo($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            blackbox {
              flash {
                ready
                supported
                totalSize
                usedSize
              }
            }
          }
        }
      }
    `),
    {
      variables: {
        connection,
      },
    }
  );

  return data?.connection.device.blackbox.flash.supported ? (
    <Box>
      <Heading use="h4">Flash</Heading>
      <Level orientation="horizontal" borderBottom="minor-1">
        <Text>
          <b>Used: </b>
          {Math.round(data.connection.device.blackbox.flash.usedSize / 1024)}
          KB
        </Text>
        <Text>
          <b>Total: </b>
          {Math.round(data.connection.device.blackbox.flash.totalSize / 1024)}
          KB
        </Text>
      </Level>
      <ProgressBar
        disabled={loading || !data.connection.device.blackbox.flash.ready}
        value={data.connection.device.blackbox.flash.usedSize}
        maxValue={data.connection.device.blackbox.flash.totalSize}
      />
    </Box>
  ) : null;
};

export default BlackboxFlashInfoProvider;
