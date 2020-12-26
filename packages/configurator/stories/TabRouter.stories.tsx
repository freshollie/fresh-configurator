import React from "react";
import { Resolvers } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { TabRouter } from "../src/routing";

export default {
  component: TabRouter,
  title: "Routing/Tab Router",
};

const selectedTab = (tab: string): Resolvers => ({
  Query: {
    configurator: () => ({
      __typename: "Configurator",
      tab,
    }),
  },
});

export const tabSelected = (): JSX.Element => (
  <MockedProvider resolvers={selectedTab("sometabid")}>
    <TabRouter>
      <div id="sometabid" style={{ backgroundColor: "white", width: "100%" }}>
        It works
      </div>
      <div id="sometabid">Because this one is not visible</div>
    </TabRouter>
  </MockedProvider>
);

export const tabNotSelected = (): JSX.Element => (
  <MockedProvider resolvers={selectedTab("someothertabid")}>
    <TabRouter>
      <div id="sometabid" style={{ backgroundColor: "white", width: "100%" }}>
        This should not be visible
      </div>
      <div id="sometabid">Because this one is not visible</div>
    </TabRouter>
  </MockedProvider>
);
