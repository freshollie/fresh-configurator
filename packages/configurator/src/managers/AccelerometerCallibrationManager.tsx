import React from "react";
import { Button } from "bumbag";
import useConnection from "../hooks/useConnection";
import useLogger from "../hooks/useLogger";
import { gql, useMutation } from "../gql/apollo";

const AccelerometerCallibrationManager: React.FC = () => {
  const connection = useConnection();
  const log = useLogger();
  const [calibrate, { loading }] = useMutation(
    gql(/* GraphQL */ `
      mutation CallibrateAccelerometer($connection: ID!) {
        deviceCallibrateAccelerometer(connectionId: $connection)
      }
    `),
    {
      variables: {
        connection,
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
