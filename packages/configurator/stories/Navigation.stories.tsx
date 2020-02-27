import React from "react";
import { MockedProvider, MockedResponse } from "@apollo/react-testing";
import Navigation from "../src/managers/Navigation";
import styled from "../src/theme";
import {
  NavigationDataDocument,
  ConnectedDocument
} from "../src/gql/__generated__";

export default {
  component: Navigation,
  title: "Managers|Navigation"
};

const Page = styled.div`
  height: 100vh;
`;

const navigationData = ({
  port,
  tab
}: {
  port: string;
  tab: string;
}): MockedResponse => ({
  request: {
    query: NavigationDataDocument
  },
  result: {
    data: {
      configurator: {
        port,
        tab
      }
    }
  }
});

const device = ({
  port,
  connected
}: {
  port: string;
  connected: boolean;
}): MockedResponse => ({
  request: {
    query: ConnectedDocument,
    variables: {
      port
    }
  },
  result: {
    data: {
      device: {
        connected
      }
    }
  }
});

export const landing = (): JSX.Element => (
  <MockedProvider
    mocks={[
      navigationData({
        port: "a",
        tab: "landing"
      }),
      device({ port: "a", connected: false })
    ]}
  >
    <Page>
      <Navigation />
    </Page>
  </MockedProvider>
);

export const firmwareFlasher = (): JSX.Element => (
  <MockedProvider
    mocks={[
      navigationData({
        port: "a",
        tab: "flasher"
      }),
      device({ port: "a", connected: false })
    ]}
  >
    <Page>
      <Navigation />
    </Page>
  </MockedProvider>
);

export const connected = (): JSX.Element => (
  <MockedProvider
    mocks={[
      navigationData({
        port: "a",
        tab: "setup"
      }),
      device({ port: "a", connected: true })
    ]}
  >
    <Page>
      <Navigation />
    </Page>
  </MockedProvider>
);
