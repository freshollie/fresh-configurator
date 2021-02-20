import { gql, useQuery } from "../gql/apollo";

export default (): string | undefined => {
  const { data: portsData } = useQuery(
    gql`
      query SelectedPort {
        configurator @client {
          port
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/useSelectedPort").SelectedPortQuery,
      import("./__generated__/useSelectedPort").SelectedPortQueryVariables
    >
  );
  return portsData?.configurator.port ?? undefined;
};
