import React from "react";
import { useCallibrateAccelerometerMutation } from "../gql/queries/Device.graphql";
import Button from "../components/Button";
import useConnectionState from "../hooks/useConnectionState";
import useLogger from "../hooks/useLogger";

const AccelerometerCallibrationManager: React.FC = () => {
  const { connection } = useConnectionState();
  const log = useLogger();
  const [calibrate, { loading }] = useCallibrateAccelerometerMutation({
    variables: {
      connection: connection ?? "",
    },
    onError: (e) => {
      log(`Error callibrating accelerometer: ${e.message}`);
    },
  });

  return (
    <Button
      data-testid="calibrate-acc-button"
      disabled={loading || !connection}
      onClick={() => calibrate()}
    >
      {loading ? "Calibrating..." : "Calibrate Accelerometer"}
    </Button>
  );
};

export default AccelerometerCallibrationManager;
