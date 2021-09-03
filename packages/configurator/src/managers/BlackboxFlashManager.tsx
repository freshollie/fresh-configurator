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
    gql`
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
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/BlackboxFlashManager").FlashDataQuery,
      import("./__generated__/BlackboxFlashManager").FlashDataQueryVariables
    >,
    {
      variables: {
        connection,
      },
      pollInterval: 500,
    }
  );

  const [eraseFlash, { loading: sendingEraseCommand }] = useMutation(
    gql`
      mutation EraseFlash($connection: ID!) {
        deviceEraseFlashData(connectionId: $connection)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/BlackboxFlashManager").EraseFlashMutation,
      import("./__generated__/BlackboxFlashManager").EraseFlashMutationVariables
    >,
    {
      awaitRefetchQueries: true,
      variables: {
        connection,
      },
      refetchQueries: [
        {
          query: gql`
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
          ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
            import("./__generated__/BlackboxFlashManager").FlashReadyQuery,
            import("./__generated__/BlackboxFlashManager").FlashReadyQueryVariables
          >,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const [createOffloadJob] = useMutation(
    gql`
      mutation CreateOffloadJob($connection: ID!) {
        createFlashDataOffloadJob(connectionId: $connection, chunkSize: 4096) {
          id
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/BlackboxFlashManager").CreateOffloadJobMutation,
      import("./__generated__/BlackboxFlashManager").CreateOffloadJobMutationVariables
    >,
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
