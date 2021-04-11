import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { Sensors } from "@betaflight/api";
import React from "react";
import { ConnectionContext } from "../src/context/ConnectionProvider";
import { gql } from "../src/gql/apollo";
import SensorsListProvider from "../src/providers/SensorListProvider";

export default {
  title: "Providers / Sensor List",
  component: [SensorsListProvider],
};

const connection = "asfasdf";

const availableSensorsResolver = (sensors: Sensors[]): MockedResponse => ({
  request: {
    query: gql`
      query AvailableSensors($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            sensors {
              available
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/SensorListProvider.stories").AvailableSensorsQuery,
      import("./__generated__/SensorListProvider.stories").AvailableSensorsQueryVariables
    >,
    variables: {
      connection,
    },
  },
  result: {
    data: {
      connection: {
        device: {
          sensors: {
            available: sensors,
          },
        },
      },
    },
  },
});

export const allDisabled: React.FC = () => (
  <ConnectionContext.Provider value={connection}>
    <MockedProvider mocks={[availableSensorsResolver([])]}>
      <SensorsListProvider />
    </MockedProvider>
  </ConnectionContext.Provider>
);

export const typicalFlightController: React.FC = () => (
  <ConnectionContext.Provider value={connection}>
    <MockedProvider
      mocks={[availableSensorsResolver([Sensors.ACCELEROMETER, Sensors.GYRO])]}
    >
      <SensorsListProvider />
    </MockedProvider>
  </ConnectionContext.Provider>
);
