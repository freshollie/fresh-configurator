import React from "react";
import { OptionButtons } from "bumbag";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnection from "../hooks/useConnection";

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
  const connection = useConnection();
  const { data, loading } = useQuery(MotorDirection, {
    variables: {
      connection,
    },
  });

  const [setDirection] = useMutation(
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
