/* eslint-disable import/prefer-default-export */
import {
  DocumentNode,
  execute,
  ExecutionArgs,
  ExecutionResult,
  OperationDefinitionNode,
} from "graphql";
import { context, schema } from "../src";
import { Context } from "../src/context";

export type PromiseOrValue<T> = Promise<T> | T;

type QueryArgs = { query: DocumentNode; variables?: Record<string, unknown> };
type MutationArgs = {
  mutation: DocumentNode;
  variables?: Record<string, unknown>;
};
type QueryFunction = (args: QueryArgs) => PromiseOrValue<ExecutionResult>;
type MutationFunction = (args: MutationArgs) => ReturnType<QueryFunction>;

type Executor = {
  query: QueryFunction;
  mutate: MutationFunction;
  context: Context;
};

const getOperationName = (document: DocumentNode): string | undefined =>
  document.definitions.find(
    (def): def is OperationDefinitionNode => def.kind === "OperationDefinition"
  )?.name?.value;

export const createExecutor = ({
  artifactsDirectory = `${__dirname}/../artifacts`,
} = {}): Executor => {
  const contextGenerator = context({
    artifactsDir: artifactsDirectory,
  });
  const executeQuery: QueryFunction = ({ query, variables }) => {
    const args: ExecutionArgs = {
      schema,
      contextValue: contextGenerator(),
      variableValues: variables,
      operationName: getOperationName(query),
      document: query,
    };

    return execute(args);
  };

  return {
    query: executeQuery,
    mutate: ({ mutation, variables }) =>
      executeQuery({ query: mutation, variables }),
    context: contextGenerator(),
  };
};
