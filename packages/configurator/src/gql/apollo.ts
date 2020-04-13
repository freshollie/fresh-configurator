/**
 * Patch apollo to remove pollIntervals from useQuery when
 * skip is set: https://github.com/apollographql/react-apollo/issues/2127
 */

import {
  useQuery as useQueryOrig,
  OperationVariables,
  QueryResult,
  QueryHookOptions,
  DocumentNode,
} from "@apollo/client";

export * from "@apollo/client";

// We are following the definitions from apollo, so any has to be used here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
  return useQueryOrig(
    query,
    options
      ? { ...options, pollInterval: options.skip ? 0 : options.pollInterval }
      : undefined
  );
}
