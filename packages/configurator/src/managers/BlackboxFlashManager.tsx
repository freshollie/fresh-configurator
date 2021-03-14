import React from "react";
import Button from "../components/Button";
import Meter from "../components/Meter";
import Table from "../components/Table";
import { gql, useMutation, useQuery } from "../gql/apollo";
import { artifactsAddress } from "../gql/client";
import { JobType } from "../gql/__generated__/schema";
import useConnectionState from "../hooks/useConnectionState";
import useJobs from "../hooks/useJobs";
import useRate from "../hooks/useRate";

const BlackboxFlashManager: React.FC = () => {
  const { connection } = useConnectionState();
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
      skip: !connection,
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
        connection: connection ?? "",
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

  const [cancelJob, { loading: cancelling }] = useMutation(
    gql`
      mutation CancelJob($jobId: ID!) {
        cancelJob(jobId: $jobId)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/BlackboxFlashManager").CancelJobMutation,
      import("./__generated__/BlackboxFlashManager").CancelJobMutationVariables
    >
  );

  const { jobs } = useJobs({ ofType: JobType.Offload });

  const erasing =
    !loading &&
    (sendingEraseCommand || !data?.connection.device.blackbox.flash.ready);

  const downloadJob = jobs.find(
    ({ completed, connectionId }) => !completed && connectionId === connection
  );

  const downloaded = jobs
    .filter(
      ({ completed, cancelled, error, connectionId, artifact }) =>
        completed &&
        !cancelled &&
        !error &&
        connectionId === connection &&
        artifact
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const rate = useRate(downloadJob?.progress ?? 0);

  return (
    <div>
      <Button
        disabled={erasing || loading || !!downloadJob}
        onClick={() => {
          eraseFlash();
        }}
      >
        {!erasing ? "Erase" : "Erasing..."}
      </Button>
      <Button
        disabled={
          erasing ||
          loading ||
          !!downloadJob ||
          (data?.connection.device.blackbox.flash.usedSize ?? 0) < 1
        }
        onClick={() => {
          createOffloadJob();
        }}
      >
        Download flash (
        {data
          ? Math.round(data.connection.device.blackbox.flash.usedSize / 1024)
          : "-"}
        KB)
      </Button>
      {downloadJob && data && (
        <>
          <div>Downloading flash</div>
          <Meter
            color="red"
            value={Math.round(downloadJob.progress / 1024)}
            min={0}
            max={Math.round(
              data.connection.device.blackbox.flash.usedSize / 1024
            )}
          />
          <div>{(rate / 1024).toFixed(2)}KB/s</div>
          <Button
            disabled={cancelling}
            onClick={() => {
              cancelJob({
                variables: {
                  jobId: downloadJob.id,
                },
              });
            }}
          >
            Cancel
          </Button>
        </>
      )}
      {downloaded.length > 1 && (
        <Table>
          {downloaded.map(({ artifact }) => (
            <tr>
              <td>{artifact}</td>
              <td>
                <a href={`${artifactsAddress}/${artifact}`} download>
                  Save
                </a>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};

export default BlackboxFlashManager;
