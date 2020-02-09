import React from "react";
import { MockedProvider, MockedResponse } from "@apollo/react-testing";
import Navigation from "../src/components/Navigation";
import styled, { ThemeProvider } from "../src/theme";
import {
  SelectedTabDocument,
  ConnectedDocument,
  SelectedPortDocument
} from "../src/gql/__generated__";

export default {
  component: Navigation,
  title: "Containers|Navigation"
};

const Page = styled.div`
  height: 1000px;
`;

const selectedPort = (port: string): MockedResponse => ({
  request: {
    query: SelectedPortDocument
  },
  result: {
    data: {
      device: {
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
      tab
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
    <ThemeProvider>
      <Page>
        <Navigation />
      </Page>
    </ThemeProvider>
  </MockedProvider>
);
