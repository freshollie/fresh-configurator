import React from "react";
import { useCallibrateAccelerometerMutation } from "../gql/__generated__";
import Button from "../components/Button";
import useConnectionState from "../hooks/useConnectionState";

const AccelerometerCallibrationManager: React.FC = () => {
  const { connection } = useConnectionState();
  const [calibrate, { loading }] = useCallibrateAccelerometerMutation({
    variables: {
      connection: connection ?? "",
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
