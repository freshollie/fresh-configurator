import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { Sensors } from "@betaflight/api";
import React from "react";
import { gql } from "../src/gql/apollo";
import { resolvers } from "../src/gql/client";
import DisabledSensorsManager from "../src/managers/DisabledSensorsManager";

export default {
  title: "Managers/Disabled Sensors",
  component: DisabledSensorsManager,
};

const disabledSensorsMock = (disabled: Sensors[]): MockedResponse => ({
  request: {
    query: gql`
      query DisabledSensors($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            sensors {
              disabled
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/DisabledSensorsManager.stories").DisabledSensorsQuery,
      import("./__generated__/DisabledSensorsManager.stories").DisabledSensorsQueryVariables
    >,
    variables: {
      connection: "abc",
    },
  },
  result: {
    data: {
      connection: {
        device: {
          sensors: {
            disabled,
          },
        },
      },
    },
  },
});

export const AccelerometerEnabled: React.FC = () => (
  <MockedProvider
    mocks={[disabledSensorsMock([])]}
    resolvers={resolvers({
      connection: "abc",
    })}
  >
    <DisabledSensorsManager />
  </MockedProvider>
);

export const AccelerometerDisabled: React.FC = () => (
  <MockedProvider
    mocks={[disabledSensorsMock([Sensors.ACCELEROMETER])]}
    resolvers={resolvers({
      connection: "abc",
    })}
  >
    <DisabledSensorsManager />
  </MockedProvider>
);
