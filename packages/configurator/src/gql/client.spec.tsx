import { advanceTo, advanceBy } from "jest-date-mock";
import client from "./client";
import {
  SetConnectionSettingsMutation,
  SetConnectionSettingsMutationVariables,
  SetConnectionSettingsDocument,
  SelectedTabDocument,
  SelectTabDocument,
  SelectTabMutation,
  SelectTabMutationVariables,
  LogMutation,
  LogMutationVariables,
  LogDocument,
} from "./mutations/Configurator.graphql";
import {
  SelectedTabQuery,
  SelectedTabQueryVariables,
  ConnectionSettingsQueryVariables,
  ConnectionSettingsQuery,
  ConnectionSettingsDocument,
  LogsDocument,
  LogsQuery,
} from "./queries/Configurator.graphql";
import { versionInfo } from "../util";

beforeEach(async () => {
  advanceTo(new Date("2020-03-01T19:00:00.000Z"));
  await client.resetStore();
});

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

    it("should allow logs to be appended", async () => {
      let { data } = await client.query<LogsQuery>({
        query: LogsDocument,
      });

      const initialMessage = {
        __typename: "Log",
        message: `Running - OS: <strong>Unknown</strong>, Chrome: <strong>4.0</strong>, Configurator: <strong>${
          versionInfo().version
        }</strong>`,
        time: "2020-03-01T19:00:00.000Z",
      };

      expect(data?.configurator.logs).toEqual([initialMessage]);

      // Move time forward by 50 minutes
      advanceBy(60 * 1000 * 50);

      const response = await client.mutate<LogMutation, LogMutationVariables>({
        mutation: LogDocument,
        variables: {
          message: "Some message to log",
        },
      });

      expect(response?.errors).toBeFalsy();

      ({ data } = await client.query<LogsQuery>({
        query: LogsDocument,
      }));

      expect(data?.configurator.logs).toEqual([
        initialMessage,
        {
          __typename: "Log",
          message: "Some message to log",
          time: "2020-03-01T19:50:00.000Z",
        },
      ]);
    });
  });
});
