import React from "react";
import styled from "../theme";
import Range from "../components/Range";
import { gql, useMutation, useQuery } from "../gql/apollo";
import useConnectionState from "../hooks/useConnectionState";
import useLogger from "../hooks/useLogger";

const Indicators = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & > :first-child {
    transform: translateX(-50%);
  }

  & > :last-child {
    transform: translateX(50%);
  }
`;

const RANGE_TO_PERCENTAGE: Record<number, number> = {
  0: 4,
  1: 5,
  2: 7,
};

const PERCENTAGE_TO_RANGE: Record<number, number> = {
  4: 0,
  5: 1,
  7: 2,
};

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
  const { connection } = useConnectionState();
  const log = useLogger();
  const { data, loading } = useQuery(IdleSpeedConfig, {
    variables: {
      connection: connection ?? "",
    },
    skip: !connection,
  });

  const [setConnection, { loading: setting }] = useMutation(
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
    <div>
      <Range
        value={
          PERCENTAGE_TO_RANGE[
            data?.connection.device.motors.digitalIdlePercent ?? 0
          ] ?? 4
        }
        step={1}
        min={0}
        max={2}
        disabled={setting || loading}
        onChange={async (e) => {
          if (connection) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const newValue = RANGE_TO_PERCENTAGE[parseInt(e.target.value, 10)]!;
            log(`Setting motor idle to <b>${newValue}%</b>`);
            setConnection({
              variables: {
                connection,
                idlePercentage: newValue,
              },
            });
          }
        }}
      />
      <Indicators>
        <div>Low</div>
        <div>Mid</div>
        <div>High</div>
      </Indicators>
    </div>
  );
};

export default MotorIdleSpeedManager;
