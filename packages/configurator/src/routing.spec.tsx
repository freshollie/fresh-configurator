import React from "react";
import { Resolvers } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor } from "./test-utils";
import { TabRouter } from "./routing";

const selectedTab = (tab: string): Resolvers => ({
  Query: {
    configurator: () => ({
      __typename: "Configurator",
      tab,
    }),
  },
});

describe("TabRouter", () => {
  it("should show the selected tab", async () => {
    const { getByText, queryByText, asFragment } = render(
      <MockedProvider resolvers={selectedTab("someSelectedTab")}>
        <TabRouter>
          <div id="someSelectedTab">Showing!</div>
          <div id="someOtherTab">Invisible!</div>
        </TabRouter>
      </MockedProvider>
    );

    await waitFor(() => getByText("Showing!"));
    expect(getByText("Showing!")).toBeVisible();
    expect(queryByText("Invisible!")).toBeFalsy();

    expect(asFragment()).toMatchSnapshot();
  });

  it("should be able to switch tabs", async () => {
    let { getByText } = render(
      <MockedProvider resolvers={selectedTab("someSelectedTab")}>
        <TabRouter>
          <div id="someSelectedTab">Showing!</div>
          <div id="someOtherTab">Show2!</div>
        </TabRouter>
      </MockedProvider>
    );

    await waitFor(() => getByText("Showing!"));
    ({ getByText } = render(
      <MockedProvider resolvers={selectedTab("someOtherTab")}>
        <TabRouter>
          <div id="someSelectedTab">Showing!</div>
          <div id="someOtherTab">Show2!</div>
        </TabRouter>
      </MockedProvider>
    ));
    await waitFor(() => getByText("Show2!"));
    expect(getByText("Show2!")).toBeVisible();
  });

  it("should show nothing if a valid tab isn't selected", async () => {
    const { getByText } = render(
      <MockedProvider resolvers={selectedTab("someInvalidTab")}>
        <TabRouter>
          <div id="someSelectedTab">Showing!</div>
          <div id="someOtherTab">Show2!</div>
        </TabRouter>
      </MockedProvider>
    );

    await expect(
      waitFor(() => getByText("Showing!"), { timeout: 100 })
    ).rejects.toEqual(expect.any(Error));
    await expect(
      waitFor(() => getByText("Show2!"), { timeout: 100 })
    ).rejects.toEqual(expect.any(Error));
  });
});
