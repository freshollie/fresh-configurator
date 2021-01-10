import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import React from "react";
import { resolvers } from "../src/gql/client";
import { MotorDigitalIdleSpeedDocument } from "../src/gql/queries/Device.graphql";
import MotorIdleSpeedManager from "../src/managers/MotorIdleSpeedManager";

export default {
  title: "Managers/Motor Idle Speed",
  component: MotorIdleSpeedManager,
};

const motorIdleMock = (percent: number): MockedResponse => ({
  request: {
    query: MotorDigitalIdleSpeedDocument,
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
  <MockedProvider
    mocks={[motorIdleMock(4)]}
    resolvers={resolvers({
      connection: "abc",
    })}
  >
    <MotorIdleSpeedManager />
  </MockedProvider>
);

export const Mid: React.FC = () => (
  <MockedProvider
    mocks={[motorIdleMock(5)]}
    resolvers={resolvers({
      connection: "abc",
    })}
  >
    <MotorIdleSpeedManager />
  </MockedProvider>
);

export const High: React.FC = () => (
  <MockedProvider
    mocks={[motorIdleMock(7)]}
    resolvers={resolvers({
      connection: "abc",
    })}
  >
    <MotorIdleSpeedManager />
  </MockedProvider>
);
