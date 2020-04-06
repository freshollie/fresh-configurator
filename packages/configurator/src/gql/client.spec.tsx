import client from "./client";
import {
  ConnectionSettingsQueryVariables,
  ConnectionSettingsQuery,
  ConnectionSettingsDocument,
  SetConnectionSettingsMutation,
  SetConnectionSettingsMutationVariables,
  SetConnectionSettingsDocument,
  SelectedTabQuery,
  SelectedTabQueryVariables,
  SelectedTabDocument,
  SelectTabDocument,
  SelectTabMutation,
  SelectTabMutationVariables,
} from "./__generated__";

describe("client", () => {
  describe("configurator", () => {
    it("should allow a port to be selected", async () => {
      let { data } = await client.query<
        ConnectionSettingsQuery,
        ConnectionSettingsQueryVariables
      >({
        query: ConnectionSettingsDocument,
      });

      expect(data?.configurator.port).toEqual(null);

      await client.mutate<
        SetConnectionSettingsMutation,
        SetConnectionSettingsMutationVariables
      >({
        mutation: SetConnectionSettingsDocument,
        variables: {
          port: "/a/test/port",
        },
      });

      ({ data } = await client.query<
        ConnectionSettingsQuery,
        ConnectionSettingsQueryVariables
      >({
        query: ConnectionSettingsDocument,
      }));

      expect(data?.configurator.port).toEqual("/a/test/port");
    });

    it("should allow tab to be selected", async () => {
      let { data } = await client.query<
        SelectedTabQuery,
        SelectedTabQueryVariables
      >({
        query: SelectedTabDocument,
      });

      expect(data?.configurator.tab).toEqual(null);

      await client.mutate<SelectTabMutation, SelectTabMutationVariables>({
        mutation: SelectTabDocument,
        variables: {
          tabId: "some-tab",
        },
      });

      ({ data } = await client.query<
        SelectedTabQuery,
        SelectedTabQueryVariables
      >({
        query: SelectedTabDocument,
      }));

      expect(data?.configurator.tab).toEqual("some-tab");
    });
  });
});
