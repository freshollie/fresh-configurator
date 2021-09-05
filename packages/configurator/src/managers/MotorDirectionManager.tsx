import React from "react";
import { OptionButtons } from "bumbag";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

const MotorDirection = gql(/* GraphQL */ `
  query MotorDirection($connection: ID!) {
    connection(connectionId: $connection) {
      device {
        motors {
          reversedDirection
        }
      }
    }
  }
`);

const MotorDirectionManager: React.FC = () => {
  const connection = useConnection();
  const { data, loading } = useQuery(MotorDirection, {
    variables: {
      connection,
    },
  });

  const [setDirection] = useMutation(
    gql(/* GraphQL */ `
      mutation SetMotorsDirection($connection: ID!, $reversed: Boolean!) {
        deviceSetMotorsDirection(connectionId: $connection, reversed: $reversed)
      }
    `),
    {
      refetchQueries: [
        {
          query: MotorDirection,
          variables: {
            connection,
          },
        },
      ],
    }
  );

  const reversed = data?.connection.device.motors.reversedDirection ?? false;

  return (
    <OptionButtons
      value={reversed.toString()}
      disabled={loading}
      type="radio"
      onChange={
        ((_: string[], value: string) => {
          setDirection({
            variables: {
              connection,
              reversed: value === "true",
            },
          });
        }) as never
      }
      options={[
        { label: "Normal", value: "false" },
        { label: "Reverse", value: "true" },
      ]}
    />
  );
};

export default MotorDirectionManager;
