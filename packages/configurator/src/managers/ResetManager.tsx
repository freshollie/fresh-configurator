import React from "react";
import { useApolloClient, useMutation } from "../gql/apollo";
import Confirmation from "../components/Confirmation";
import Button from "../components/Button";
import { ResetDocument } from "../gql/mutations/Device.graphql";
import useConnectionState from "../hooks/useConnectionState";
import useLogger from "../hooks/useLogger";

const ResetManager: React.FC = () => {
  const { connection } = useConnectionState();
  const client = useApolloClient();
  const log = useLogger();

  const [reset, { loading }] = useMutation(ResetDocument, {
    variables: {
      connection: connection ?? "",
    },
    onCompleted: async () => {
      await client.reFetchObservableQueries();
      log(`Settings restored to <b>default</b>`);
    },
    onError: () => {
      log(`Error resetting flight controller`);
    },
  });
  return (
    <Confirmation
      confirmText="Reset"
      cancelText="Cancel"
      message="WARNING: Are you sure you want to reset ALL settings to default?"
      title="Confirm"
    >
      {(confirm) => (
        <Button disabled={loading} onClick={() => confirm(reset)}>
          Reset Settings
        </Button>
      )}
    </Confirmation>
  );
};

export default ResetManager;
