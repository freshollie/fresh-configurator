import React from "react";
import { useMutation, useQuery } from "../gql/apollo";
import { MotorDirectionDocument } from "../gql/queries/Device.graphql";
import { SetMotorsDirectionDocument } from "../gql/mutations/Device.graphql";
import useConnectionState from "../hooks/useConnectionState";

const MotorDirectionManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading } = useQuery(MotorDirectionDocument, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const [setDirection, { loading: setting }] = useMutation(
    SetMotorsDirectionDocument,
    {
      refetchQueries: [
        {
          query: MotorDirectionDocument,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const reversed = data?.connection.device.motors.reversedDirection ?? false;

  return (
    <form onChange={(e) => e.target}>
      {(["Normal", "Reverse"] as const).map((name) => (
        <label htmlFor={name}>
          <input
            type="radio"
            value={name}
            key={name}
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
