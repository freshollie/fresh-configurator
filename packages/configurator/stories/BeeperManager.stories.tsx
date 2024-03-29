import { gql } from "@apollo/client";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { Beepers } from "@betaflight/api";
import React from "react";
import { ConnectionContext } from "../src/renderer/context/ConnectionProvider";
import BeeperManager from "../src/renderer/managers/BeeperManager";

export default {
  title: "Managers/Beeper",
  component: BeeperManager,
};

const dshotBeeperConfigMock = (enabled: boolean): MockedResponse => ({
  request: {
    query: gql(/* GraphQL */ `
      query DshotBeeperConfig($connection: ID!) {
        connection(connectionId: $connection) {
          device {
            beeper {
              dshot {
                conditions
                tone
              }
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
  <MockedProvider mocks={[dshotBeeperConfigMock(false)]}>
    <ConnectionContext.Provider value="abc">
      <BeeperManager />
    </ConnectionContext.Provider>
  </MockedProvider>
);

export const On: React.FC = () => (
  <MockedProvider mocks={[dshotBeeperConfigMock(true)]}>
    <ConnectionContext.Provider value="abc">
      <BeeperManager />
    </ConnectionContext.Provider>
  </MockedProvider>
);
