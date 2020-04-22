/**
 * Patch apollo to remove pollIntervals from useQuery when
 * skip is set: https://github.com/apollographql/react-apollo/issues/2127
 */

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import {
  useQuery as useQueryOrig,
  QueryHookOptions,
} from "@apollo/react-hooks";
import { OperationVariables, QueryResult } from "@apollo/react-common";
import { DocumentNode } from "graphql";

export * from "@apollo/react-hooks";

// We are following the definitions from apollo, so any has to be used here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
  return useQueryOrig(
    query,
    options
      ? {
          ...options,
          pollInterval:
            options.skip && options.pollInterval ? 0 : options.pollInterval,

          // IMPORTANT: Apollo has some bug where components don't rerender when
          // they should unless this is enabled!
          notifyOnNetworkStatusChange: !options.pollInterval,
        }
      : undefined
  );
}

export type ApolloContext = { client: ApolloClient<InMemoryCache> };
