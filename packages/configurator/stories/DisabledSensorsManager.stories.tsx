import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { Sensors } from "@betaflight/api";
import React from "react";
import { ConnectionContext } from "../src/renderer/context/ConnectionProvider";
import { gql } from "../src/renderer/gql/apollo";
import DisabledSensorManager from "../src/renderer/managers/DisabledSensorManager";

export default {
  title: "Managers/Disabled Sensor",
  component: DisabledSensorManager,
};

const disabledSensorsMock = (disabled: Sensors[]): MockedResponse => ({
  request: {
    query: gql(/* GraphQL */ `
      query DisabledSensors($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            sensors {
              disabled
            }
          }
        }
      }
    `),
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
  <MockedProvider mocks={[disabledSensorsMock([])]}>
    <ConnectionContext.Provider value="abc">
      <DisabledSensorManager sensor={Sensors.ACCELEROMETER} />
    </ConnectionContext.Provider>
  </MockedProvider>
);

export const AccelerometerDisabled: React.FC = () => (
  <MockedProvider mocks={[disabledSensorsMock([Sensors.ACCELEROMETER])]}>
    <ConnectionContext.Provider value="abc">
      <DisabledSensorManager sensor={Sensors.ACCELEROMETER} />
    </ConnectionContext.Provider>
  </MockedProvider>
);
