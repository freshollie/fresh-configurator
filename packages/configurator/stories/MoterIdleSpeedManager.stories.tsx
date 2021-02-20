import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import React from "react";
import { gql } from "../src/gql/apollo";
import { resolvers } from "../src/gql/client";
import MotorIdleSpeedManager from "../src/managers/MotorIdleSpeedManager";

export default {
  title: "Managers/Motor Idle Speed",
  component: MotorIdleSpeedManager,
};

const motorIdleMock = (percent: number): MockedResponse => ({
  request: {
    query: gql`
      query MotorDigitleIdleSpeed($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            motors {
              digitalIdlePercent
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/MoterIdleSpeedManager.stories").MotorDigitleIdleSpeedQuery,
      import("./__generated__/MoterIdleSpeedManager.stories").MotorDigitleIdleSpeedQueryVariables
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
