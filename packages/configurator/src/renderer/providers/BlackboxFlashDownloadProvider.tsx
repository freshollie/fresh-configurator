import { faDownload, faFile } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Callout,
  Overlay,
  ProgressBar,
  Box,
  Text,
  Level,
} from "bumbag";
import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "../gql/apollo";
import { artifactsAddress } from "../gql/client";
import { JobType } from "../gql/__generated__/schema";
import useConnection from "../hooks/useConnection";
import useJobs from "../hooks/useJobs";
import useRate from "../hooks/useRate";

const BlackboxFlashDownloadProvider: React.FC = () => {
  const connection = useConnection();
  const overlay = Overlay.useState({ visible: true, animated: true });
  const [currentDownload, setCurrentDownload] = useState<string | undefined>(
    undefined
  );

  const { data } = useQuery(
    gql(/* GraphQL */ `
      query BlackboxFlashUsed($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            blackbox {
              flash {
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

  const { jobs } = useJobs({ ofType: JobType.Offload });

  const downloadJob = jobs.find(
    ({ completed, connectionId }) => !completed && connectionId === connection
  );

  const downloadJobId = downloadJob?.id;
  const { setVisible } = overlay;
  useEffect(() => {
    if (downloadJobId) {
      setCurrentDownload(downloadJobId);
      setVisible(true);
    }
  }, [downloadJobId, setVisible]);

  const downloaded = jobs.find(
    ({ id, completed, cancelled, error, connectionId, artifact }) =>
      completed &&
      !cancelled &&
      !error &&
      connectionId === connection &&
      artifact &&
      id === currentDownload
  );

  const rate = useRate(downloadJob?.progress ?? 0);

  const [cancelJob, { loading: cancelling }] = useMutation(
    gql(/* GraphQL */ `
      mutation CancelJob($jobId: ID!) {
        cancelJob(jobId: $jobId)
      }
    `)
  );

  const ButtonProps = Button.useProps();
  if (downloaded) {
    return (
      <Callout.Overlay
        fade
        hideOnClickOutside={false}
        hideOnEsc={false}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...overlay}
        showCloseButton
        width="500px"
        standalone
      >
        <Callout.Icon
          iconProps={{ icon: faFile, type: "font-awesome" } as never}
        />
        <Box width="100%">
          <Callout.Header>
            <Callout.Title>Download complete</Callout.Title>
          </Callout.Header>
          <Callout.Content>
            <Text>{downloaded.artifact}</Text>
          </Callout.Content>
          <Callout.Footer>
            <a
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...ButtonProps}
              href={`${artifactsAddress}/${downloaded.artifact}`}
              download
            >
              Save
            </a>
          </Callout.Footer>
        </Box>
      </Callout.Overlay>
    );
  }

  return downloadJob && data ? (
    <Callout.Overlay
      fade
      slide
      hideOnClickOutside={false}
      hideOnEsc={false}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...overlay}
      showCloseButton={false}
      standalone
      width="500px"
    >
      <Callout.Icon
        iconProps={{ icon: faDownload, type: "font-awesome" } as never}
      />
      <Box width="100%">
        <Callout.Header>
          <Callout.Title>Downloading blackbox data</Callout.Title>
        </Callout.Header>
        <Callout.Content>
          <Level>
            <Text>
              {Math.floor(downloadJob.progress / 1024)}KB /{" "}
              {Math.floor(
                data.connection.device.blackbox.flash.usedSize / 1024
              )}
              KB
            </Text>
            <Text>{(rate / 1024).toFixed(2)}KB/s</Text>
          </Level>
          <ProgressBar
            value={downloadJob.progress}
            maxValue={data.connection.device.blackbox.flash.usedSize}
          />
        </Callout.Content>
        <Callout.Footer>
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
        </Callout.Footer>
      </Box>
    </Callout.Overlay>
  ) : null;
};

export default BlackboxFlashDownloadProvider;
