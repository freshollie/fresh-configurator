import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { Sensors } from "@betaflight/api";
import React from "react";
import { resolvers } from "../src/gql/client";
import { DisabledSensorsDocument } from "../src/gql/queries/Device.graphql";
import DisabledSensorsManager from "../src/managers/DisabledSensorsManager";

export default {
  title: "Managers/Disabled Sensors",
  component: DisabledSensorsManager,
};

const disabledSensorsMock = (disabled: Sensors[]): MockedResponse => ({
  request: {
    query: DisabledSensorsDocument,
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
