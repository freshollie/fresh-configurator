import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import React from "react";
import { ConnectionContext } from "../src/context/ConnectionProvider";
import { gql } from "../src/gql/apollo";
import MotorIdleSpeedManager from "../src/managers/MotorIdleSpeedManager";

export default {
  title: "Managers/Motor Idle Speed",
  component: MotorIdleSpeedManager,
};

const motorIdleMock = (percent: number): MockedResponse => ({
  request: {
    query: gql`
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
      import("./__generated__/MoterIdleSpeedManager.stories").MotorDigitalIdleSpeedQuery,
      import("./__generated__/MoterIdleSpeedManager.stories").MotorDigitalIdleSpeedQueryVariables
    >,
    variables: {
      connection: "abc",
    },
  },
  result: {
    data: {
      connection: {
        device: {
          motors: {
            digitalIdlePercent: percent,
          },
        },
      },
    },
  },
});

export const Low: React.FC = () => (
  <MockedProvider mocks={[motorIdleMock(4)]}>
    <ConnectionContext.Provider value="abc">
      <MotorIdleSpeedManager />
    </ConnectionContext.Provider>
  </MockedProvider>
);

export const Mid: React.FC = () => (
  <MockedProvider mocks={[motorIdleMock(5)]}>
    <ConnectionContext.Provider value="abc">
      <MotorIdleSpeedManager />
    </ConnectionContext.Provider>
  </MockedProvider>
);

export const High: React.FC = () => (
  <MockedProvider mocks={[motorIdleMock(7)]}>
    <ConnectionContext.Provider value="abc">
      <MotorIdleSpeedManager />
    </ConnectionContext.Provider>
  </MockedProvider>
);
