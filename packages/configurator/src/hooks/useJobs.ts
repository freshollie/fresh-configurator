import { useEffect, useMemo } from "react";
import { gql, useQuery } from "../gql/apollo";
import {
  JobDetails,
  JobType,
  JobUpdateType,
} from "../gql/__generated__/schema";

export default ({
  ofType,
}: {
  ofType?: JobType;
}): { loading: boolean; jobs: readonly JobDetails[] } => {
  const { data, subscribeToMore, loading } = useQuery(
    gql`
      query Jobs($ofType: JobType) {
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
          artifact
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/useJobs").JobsQuery,
      import("./__generated__/useJobs").JobsQueryVariables
    >,
    {
      fetchPolicy: "cache-and-network",
      variables: {
        ofType,
      },
    }
  );

  useEffect(
    () =>
      subscribeToMore({
        document: gql`
          subscription JobUpdates($ofType: JobType) {
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
                artifact
                createdAt
              }
            }
          }
        ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
          import("./__generated__/useJobs").JobUpdatesSubscription,
          import("./__generated__/useJobs").JobUpdatesSubscriptionVariables
        >,
        variables: {
          ofType,
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
    [subscribeToMore, ofType]
  );

  return useMemo(() => ({ loading, jobs: data?.jobs ?? [] }), [data, loading]);
};
