import React from "react";
import { MockedProvider, MockedResponse } from "@apollo/react-testing";
import TabRouter from "../src/managers/TabRouter";
import { SelectedTabDocument } from "../src/gql/__generated__";

export default {
  component: TabRouter,
  title: "Managers|Tab Router"
};

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

export const tabSelected = (): JSX.Element => (
  <MockedProvider mocks={[selectedTab("sometabid")]}>
    <TabRouter>
      <div id="sometabid" style={{ backgroundColor: "white", width: "100%" }}>
        It works
      </div>
      <div id="sometabid">Because this one is not visible</div>
    </TabRouter>
  </MockedProvider>
);

export const tabNotSelected = (): JSX.Element => (
  <MockedProvider mocks={[selectedTab("someothertabid")]}>
    <TabRouter>
      <div id="sometabid" style={{ backgroundColor: "white", width: "100%" }}>
        This should not be visible
      </div>
      <div id="sometabid">Because this one is not visible</div>
    </TabRouter>
  </MockedProvider>
);
