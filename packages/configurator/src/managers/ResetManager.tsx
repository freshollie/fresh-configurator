import React, { useState } from "react";
import { Button, Modal, Dialog, Alert } from "bumbag";
import { ApolloError, gql, useApolloClient, useMutation } from "../gql/apollo";
import useLogger from "../hooks/useLogger";
import useConnection from "../hooks/useConnection";

const ResetManager: React.FC = () => {
  const connection = useConnection();
  const client = useApolloClient();
  const [error, setError] = useState<ApolloError | undefined>();
  const modal = Modal.useState({ animated: true });
  const log = useLogger();

  const [reset, { loading }] = useMutation(
    gql`
      mutation Reset($connection: ID!) {
        deviceReset(connectionId: $connection)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/ResetManager").ResetMutation,
      import("./__generated__/ResetManager").ResetMutationVariables
    >,
    {
      variables: {
        connection,
      },
      onCompleted: async () => {
        // make the client refetch all of these
        client.cache.evict({
          fieldName: "connection",
          args: {
            connection,
          },
        });
        await client.reFetchObservableQueries();
        log(`Settings restored to <b>default</b>`);
        modal.hide();
      },
      onError: (e) => {
        log(`Error resetting flight controller`);
        setError(e);
      },
    }
  );
  return (
    <>
      <Dialog.Modal
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...modal}
        fade
        slide
        baseId="reset-confirmation"
        showActionButtons
        title="Reset device"
        type="danger"
        actionButtonsProps={{
          submitText: "Reset",
          isLoading: loading,
          onClickSubmit: reset,
          onClickCancel: () => {
            modal.hide();
          },
        }}
      >
        {error && (
          <Alert variant="tint" type="warning">
            {error.message}
          </Alert>
        )}
        Are you sure you want to reset ALL settings to default?
      </Dialog.Modal>
      <Button
        onClick={() => {
          modal.show();
          setError(undefined);
        }}
      >
        Reset Settings
      </Button>
    </>
  );
};

export default ResetManager;
