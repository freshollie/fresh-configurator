import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { Beepers } from "@betaflight/api";
import React from "react";
import { resolvers } from "../src/gql/client";
import { DshotBeeperConfigDocument } from "../src/gql/queries/Device.graphql";
import BeeperManager from "../src/managers/BeeperManager";

export default {
  title: "Managers/Beeper",
  component: BeeperManager,
};

const dshotBeeperConfigMock = (enabled: boolean): MockedResponse => ({
  request: {
    query: DshotBeeperConfigDocument,
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
