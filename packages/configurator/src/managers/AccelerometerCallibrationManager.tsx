import React from "react";
import Button from "../components/Button";
import useConnectionState from "../hooks/useConnectionState";
import useLogger from "../hooks/useLogger";
import { gql, useMutation } from "../gql/apollo";

const AccelerometerCallibrationManager: React.FC = () => {
  const { connection } = useConnectionState();
  const log = useLogger();
  const [calibrate, { loading }] = useMutation(
    gql`
      mutation CallibrateAccelerometer($connection: ID!) {
        deviceCallibrateAccelerometer(connectionId: $connection)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/AccelerometerCallibrationManager").CallibrateAccelerometerMutation,
      import("./__generated__/AccelerometerCallibrationManager").CallibrateAccelerometerMutationVariables
    >,
    {
      variables: {
        connection: connection ?? "",
      },
      onCompleted: () => {
        log(
          'Accelerometer calibration <span class="message-positive">finished</span>'
        );
      },
      onError: (e) => {
        log(`Error callibrating accelerometer: ${e.message}`);
      },
    }
  );

  return (
    <Button
      data-testid="calibrate-acc-button"
      disabled={loading || !connection}
      onClick={() => {
        calibrate();
        log("Accelerometer calibration started");
      }}
    >
      {loading ? "Calibrating..." : "Calibrate Accelerometer"}
    </Button>
  );
};

export default AccelerometerCallibrationManager;
