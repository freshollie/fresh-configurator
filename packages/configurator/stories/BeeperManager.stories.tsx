import { gql } from "@apollo/client";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { Beepers } from "@betaflight/api";
import React from "react";
import { resolvers } from "../src/gql/client";
import BeeperManager from "../src/managers/BeeperManager";

export default {
  title: "Managers/Beeper",
  component: BeeperManager,
};

const dshotBeeperConfigMock = (enabled: boolean): MockedResponse => ({
  request: {
    query: gql`
      query DshotBeeperConfig($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            beeper {
              dshot {
                tone
                conditions
              }
            }
          }
        }
      }
    ` as import("@graphql-typed-document-node/core").TypedDocumentNode<
      import("./__generated__/BeeperManager.stories").DshotBeeperConfigQuery,
      import("./__generated__/BeeperManager.stories").DshotBeeperConfigQueryVariables
    >,
    variables: {
      connection: "abc",
    },
  },
  result: {
    data: {
      connection: {
        device: {
          beeper: {
            dshot: enabled
              ? {
                  tone: 1,
                  conditions: [Beepers.RX_LOST, Beepers.RX_SET],
                }
              : {
                  tone: 0,
                  conditions: [],
                },
          },
        },
      },
    },
  },
});

export const Off: React.FC = () => (
  <MockedProvider
    mocks={[dshotBeeperConfigMock(false)]}
    resolvers={resolvers({
      connection: "abc",
    })}
  >
    <BeeperManager />
  </MockedProvider>
);

export const On: React.FC = () => (
  <MockedProvider
    mocks={[dshotBeeperConfigMock(true)]}
    resolvers={resolvers({
      connection: "abc",
    })}
  >
    <BeeperManager />
  </MockedProvider>
);
