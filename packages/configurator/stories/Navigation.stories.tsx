import React from "react";
import { Resolvers } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import Navigation from "../src/managers/NavigationManager";
import styled from "../src/theme";

export default {
  component: Navigation,
  title: "Managers/Navigation",
};

const Page = styled.div`
  height: 100vh;
`;

const configuratorResolvers = (
  port: string,
  tab: string,
  connection: string | undefined,
  connecting: boolean
): Resolvers => ({
  Query: {
    configurator: () => ({
      __typename: "Configurator",
      port,
      tab,
      connection,
      connecting,
    }),
  },
});

export const landing = (): JSX.Element => (
  <MockedProvider
    resolvers={configuratorResolvers("a", "landing", undefined, false)}
  >
    <Page>
      <Navigation />
    </Page>
  </MockedProvider>
);

export const firmwareFlasher = (): JSX.Element => (
  <MockedProvider
    resolvers={configuratorResolvers("a", "flasher", undefined, false)}
  >
    <Page>
      <Navigation />
    </Page>
  </MockedProvider>
);

export const connected = (): JSX.Element => (
  <MockedProvider
    resolvers={configuratorResolvers("a", "setup", "someId", false)}
  >
    <Page>
      <Navigation />
    </Page>
  </MockedProvider>
);
