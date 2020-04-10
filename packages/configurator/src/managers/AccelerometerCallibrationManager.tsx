import React from "react";
import { useCallibrateAccelerometerMutation } from "../gql/__generated__";
import useSelectedPort from "../hooks/useSelectedPort";
import Button from "../components/Button";

const AccelerometerCallibrationManager: React.FC = () => {
  const port = useSelectedPort();
  const [calibrate, { loading }] = useCallibrateAccelerometerMutation({
    variables: {
      port: port ?? "",
    },
  });

  return (
    <Button
      data-testid="calibrate-acc-button"
      disabled={loading || !port}
      onClick={() => calibrate()}
    >
      {loading ? "Calibrating..." : "Calibrate Accelerometer"}
    </Button>
  );
};

export default AccelerometerCallibrationManager;
