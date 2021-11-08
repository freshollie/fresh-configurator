import { useEffect, useMemo } from "react";
import { gql, useQuery } from "../gql/apollo";
import { JobType, JobUpdateType } from "../gql/__generated__/schema";

// Codegen makes a good set of return values here
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default ({
  ofType,
  fetchArtifactData = false,
}: {
  ofType?: JobType;
  fetchArtifactData?: boolean;
}) => {
  const { data, subscribeToMore, loading } = useQuery(
    gql(/* GraphQL */ `
      query Jobs($ofType: JobType, $fetchData: Boolean!) {
        jobs(ofType: $ofType) {
          id
          connectionId
          completed
          progress
          error {
            message
          }
          cancelled
          type
          createdAt
          artifact {
            id
            data @include(if: $fetchData)
          }
        }
      }
    `),
    {
      fetchPolicy: "cache-and-network",
      variables: {
        ofType,
        fetchData: fetchArtifactData,
      },
    }
  );

  useEffect(
    () =>
      subscribeToMore({
        document: gql(/* GraphQL */ `
          subscription JobUpdates($ofType: JobType, $fetchData: Boolean!) {
            jobUpdates(ofType: $ofType) {
              type
              details {
                id
                connectionId
                completed
                progress
                error {
                  message
                }
                cancelled
                type
                connectionId
                artifact {
                  id
                  data @include(if: $fetchData)
                }
                createdAt
              }
            }
          }
        `),
        variables: {
          ofType,
          fetchData: fetchArtifactData,
        },
        updateQuery: (prev, { subscriptionData }) => {
          switch (subscriptionData.data.jobUpdates.type) {
            case JobUpdateType.Changed:
              return {
                ...prev,
                jobs: prev.jobs.map((job) =>
                  job.id === subscriptionData.data.jobUpdates.details.id
                    ? subscriptionData.data.jobUpdates.details
                    : job
                ),
              };
            case JobUpdateType.New:
              return {
                ...prev,
                jobs: prev.jobs.concat([
                  subscriptionData.data.jobUpdates.details,
                ]),
              };
            case JobUpdateType.Removed:
              return {
                ...prev,
                jobs: prev.jobs.filter(
                  ({ id }) => subscriptionData.data.jobUpdates.details.id !== id
                ),
              };
            default:
              return prev;
          }
        },
      }),
    [subscribeToMore, ofType, fetchArtifactData]
  );

  return useMemo(() => ({ loading, jobs: data?.jobs ?? [] }), [data, loading]);
};
