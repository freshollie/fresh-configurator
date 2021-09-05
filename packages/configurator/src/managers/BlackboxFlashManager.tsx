import React from "react";
import { Button, Set } from "bumbag";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { gql, useMutation, useQuery } from "../gql/apollo";
import { JobType } from "../gql/__generated__/schema";
import useJobs from "../hooks/useJobs";
import useConnection from "../hooks/useConnection";

const BlackboxFlashManager: React.FC = () => {
  const connection = useConnection();
  const { data, loading } = useQuery(
    gql(/* GraphQL */ `
      query FlashData($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            variant
            name
            blackbox {
              flash {
                ready
                supported
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
      pollInterval: 500,
    }
  );

  const [eraseFlash, { loading: sendingEraseCommand }] = useMutation(
    gql(/* GraphQL */ `
      mutation EraseFlash($connection: ID!) {
        deviceEraseFlashData(connectionId: $connection)
      }
    `),
    {
      awaitRefetchQueries: true,
      variables: {
        connection,
      },
      refetchQueries: [
        {
          query: gql(/* GraphQL */ `
            query FlashReady($connection: ID!) {
              connection(connectionId: $connection) {
                device {
                  blackbox {
                    flash {
                      ready
                    }
                  }
                }
              }
            }
          `),
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const [createOffloadJob] = useMutation(
    gql(/* GraphQL */ `
      mutation CreateOffloadJob($connection: ID!) {
        createFlashDataOffloadJob(connectionId: $connection, chunkSize: 4096) {
          id
        }
      }
    `),
    {
      context: { retry: false },
      variables: {
        connection,
      },
    }
  );

  const flashSupported = !!data?.connection.device.blackbox.flash.supported;

  const { jobs } = useJobs({ ofType: JobType.Offload });

  const erasing =
    !loading &&
    (sendingEraseCommand ||
      (flashSupported && !data.connection.device.blackbox.flash.ready));

  const downloadJob = jobs.find(
    ({ completed, connectionId }) => !completed && connectionId === connection
  );

  return flashSupported ? (
    <Set>
      <Button
        size="small"
        iconBeforeProps={{
          type: "font-awesome",
        }}
        iconBefore={faDownload}
        disabled={
          erasing ||
          loading ||
          !!downloadJob ||
          data.connection.device.blackbox.flash.usedSize < 1
        }
        onClick={() => {
          createOffloadJob();
        }}
      >
        Download
      </Button>
      <Button
        color="danger"
        size="small"
        iconBeforeProps={{
          type: "font-awesome",
        }}
        iconBefore={faTrash}
        disabled={erasing || loading || !!downloadJob}
        onClick={() => {
          eraseFlash();
        }}
      >
        {!erasing ? "Erase" : "Erasing..."}
      </Button>
    </Set>
  ) : null;
};

export default BlackboxFlashManager;
