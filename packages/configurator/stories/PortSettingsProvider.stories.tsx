import React from "react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import PortSettingsManager from "../src/managers/PortSettingsManager";
import { DevicePortSettingsDocument } from "../src/gql/queries/Device.graphql";

export default {
  component: PortSettingsManager,
  title: "Managers/Port Settings",
};

const resolvers = {
  Query: {
    configurator: () => ({
      connection: "abc",
      connecting: false,
      __typename: "Configurator",
    }),
  },
};

const portSettingsMock: MockedResponse = {
  request: {
    query: DevicePortSettingsDocument,
    variables: {
      connection: "abc",
    },
  },
  result: {
    data: {
      connection: {
        __typename: "Connection",
        device: {
          __typename: "FlightController",
          serial: {
            __typename: "Serial",
            ports: [
              {
                __typename: "port",
                blackboxBaudRate: 115200,
                functions: [0],
                gpsBaudRate: 57600,
                id: 0,
                mspBaudRate: 115200,
                telemetryBaudRate: -1,
              },
              {
                __typename: "port",
                blackboxBaudRate: 115200,
                functions: [13],
                gpsBaudRate: 57600,
                id: 1,
                mspBaudRate: 115200,
                telemetryBaudRate: -1,
              },
              {
                __typename: "port",
                blackboxBaudRate: 115200,
                functions: [7],
                gpsBaudRate: 57600,
                id: 2,
                mspBaudRate: 115200,
                telemetryBaudRate: -1,
              },
            ],
          },
        },
      },
    },
  },
};

export const somePorts = (): JSX.Element => (
  <MockedProvider mocks={[portSettingsMock]} resolvers={resolvers}>
    <PortSettingsManager />
  </MockedProvider>
);
