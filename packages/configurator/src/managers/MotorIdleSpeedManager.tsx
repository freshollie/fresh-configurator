import React from "react";
import { OptionButtons } from "bumbag";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useLogger from "../hooks/useLogger";
import useConnection from "../hooks/useConnection";

const IdleSpeedConfig = gql`
  query MotorDigitalIdleSpeed($connection: ID!) {
    connection(connectionId: $connection) {
      device {
        motors {
          digitalIdlePercent
        }
      }
    }
  }
` as import("@graphql-typed-document-node/core").TypedDocumentNode<
  import("./__generated__/MotorIdleSpeedManager").MotorDigitalIdleSpeedQuery,
  import("./__generated__/MotorIdleSpeedManager").MotorDigitalIdleSpeedQueryVariables
>;

const MotorIdleSpeedManager: React.FC = () => {
  const connection = useConnection();
  const log = useLogger();
  const { data, loading } = useQuery(IdleSpeedConfig, {
    variables: {
      connection,
    },
  });

  const [setConnection] = useMutation(
    gql`
      mutation SetMotorDigitalIdleSpeed(
        $connection: ID!
        $idlePercentage: Float!
      ) {
        deviceSetDigitalIdleSpeed(
          connectionId: $connection
          idlePercentage: $idlePercentage
        )
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/MotorIdleSpeedManager").SetMotorDigitalIdleSpeedMutation,
      import("./__generated__/MotorIdleSpeedManager").SetMotorDigitalIdleSpeedMutationVariables
    >,
    {
      onError: (e) =>
        log(
          `Setting motor idle speed failed <span class="message-negative">failed</span>: ${e.message}`
        ),
      onCompleted: () =>
        log(
          `Motor idle speed set <span class="message-positive">successfully</span>`
        ),
      refetchQueries: [
        {
          query: IdleSpeedConfig,
          variables: {
            connection,
          },
        },
      ],
      awaitRefetchQueries: true,
    }
  );
  return (
    <OptionButtons
      value={Math.floor(
        data?.connection.device.motors.digitalIdlePercent ?? 0
      ).toString()}
      disabled={loading}
      type="radio"
      options={[
        { label: "Low", value: "4" },
        { label: "Medium", value: "5" },
        { label: "High", value: "7" },
      ]}
      onChange={
        ((_: string[], value: string) => {
          if (connection) {
            log(`Setting motor idle to <b>${value}%</b>`);
            setConnection({
              variables: {
                connection,
                idlePercentage: Number(value),
              },
            });
          }
        }) as never
      }
    />
  );
};

export default MotorIdleSpeedManager;
