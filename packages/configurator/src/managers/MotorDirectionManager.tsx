import React from "react";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnectionState from "../hooks/useConnectionState";

const MotorDirection = gql`
  query MotorDirection($connection: ID!) {
    connection(connectionId: $connection) {
      device {
        motors {
          reversedDirection
        }
      }
    }
  }
` as import("@graphql-typed-document-node/core").TypedDocumentNode<
  import("./__generated__/MotorDirectionManager").MotorDirectionQuery,
  import("./__generated__/MotorDirectionManager").MotorDirectionQueryVariables
>;

const MotorDirectionManager: React.FC = () => {
  const { connection } = useConnectionState();
  const { data, loading } = useQuery(MotorDirection, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const [setDirection, { loading: setting }] = useMutation(
    gql`
      mutation SetMotorsDirection($connection: ID!, $reversed: Boolean!) {
        deviceSetMotorsDirection(connectionId: $connection, reversed: $reversed)
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/MotorDirectionManager").SetMotorsDirectionMutation,
      import("./__generated__/MotorDirectionManager").SetMotorsDirectionMutationVariables
    >,
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
