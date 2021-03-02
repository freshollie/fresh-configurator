/**
 * Patch apollo to remove pollIntervals from useQuery when
 * skip is set: https://github.com/apollographql/react-apollo/issues/2127
 */

import {
  ApolloClient,
  InMemoryCache,
  QueryResult,
  useQuery as useQueryOrig,
  QueryHookOptions,
  OperationVariables,
  TypedDocumentNode,
} from "@apollo/client";
import { DocumentNode } from "graphql";

export * from "@apollo/client";

// We are following the definitions from apollo, so any has to be used here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
  const result = useQueryOrig(
    query,
    options
      ? {
          ...options,
          pollInterval:
            options.skip && options.pollInterval
              ? undefined
              : options.pollInterval,

          // IMPORTANT: Apollo has some bug where components don't rerender when
          // they should unless this is enabled!
          notifyOnNetworkStatusChange: !options.pollInterval,
        }
      : undefined
  );
  // Use the original apollo implementation to show the previous data
  // when loading new data from a query change
  // https://github.com/apollographql/apollo-client/issues/7038
  result.data = result.data ?? result.previousData;
  return result;
}

export type ApolloContext = { client: ApolloClient<InMemoryCache> };
