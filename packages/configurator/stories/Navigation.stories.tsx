import React from "react";
import { MockedProvider, MockedResponse } from "@apollo/react-testing";
import Navigation from "../src/managers/Navigation";
import styled, { ThemeProvider } from "../src/theme";
import {
  SelectedTabDocument,
  ConnectedDocument,
  SelectedPortDocument
} from "../src/gql/__generated__";

export default {
  component: Navigation,
  title: "Managers|Navigation"
};

const Page = styled.div`
  height: 100vh;
`;

const selectedPort = (port: string): MockedResponse => ({
  request: {
    query: SelectedPortDocument
  },
  result: {
    data: {
      configurator: {
        port
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

const selectedTab = (tab: string): MockedResponse => ({
  request: {
    query: SelectedTabDocument
  },
  result: {
    data: {
      configurator: {
        tab
      }
    }
  }
});

export const landing = (): JSX.Element => (
  <MockedProvider
    mocks={[
      selectedPort("a"),
      device({ port: "a", connected: false }),
      selectedTab("landing")
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
      selectedPort("a"),
      device({ port: "a", connected: false }),
      selectedTab("flasher")
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
      selectedPort("a"),
      device({ port: "a", connected: true }),
      selectedTab("setup")
    ]}
  >
    <Page>
      <Navigation />
    </Page>
  </MockedProvider>
);
