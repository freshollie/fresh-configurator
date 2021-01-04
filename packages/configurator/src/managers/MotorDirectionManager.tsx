import React from "react";
import {
  MotorDirectionDocument,
  useMotorDirectionQuery,
} from "../gql/queries/Device.graphql";
import { useSetMotorsDirectionMutation } from "../gql/__generated__";
import useConnectionState from "../hooks/useConnectionState";

const MotorDirectionManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading } = useMotorDirectionQuery({
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const [setDirection, { loading: setting }] = useSetMotorsDirectionMutation({
    refetchQueries: [
      {
        query: MotorDirectionDocument,
        variables: {
          connection,
        },
      },
    ],
  });

  const reversed = data?.connection.device.motors.reversedDirection ?? false;

  return (
    <form onChange={(e) => e.target}>
      {(["Normal", "Reverse"] as const).map((name) => (
        <label htmlFor={name}>
          <input
            type="radio"
            value={name}
            disabled={setting || loading}
            checked={
              (name === "Normal" && !reversed) ||
              (name === "Reverse" && reversed)
            }
            onChange={(e) => {
              setDirection({
                variables: {
                  connection: connection ?? "",
                  reversed: e.target.value === "Reverse",
                },
              });
            }}
          />
          {name}
        </label>
      ))}
    </form>
  );
};

export default MotorDirectionManager;
