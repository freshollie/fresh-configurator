import client from "./client";
import {
  SelectedPortQueryVariables,
  SelectedPortQuery,
  SelectedPortDocument,
  SelectPortMutation,
  SelectPortMutationVariables,
  SelectPortDocument,
  SelectedTabQuery,
  SelectedTabQueryVariables,
  SelectedTabDocument,
  SelectTabDocument,
  SelectTabMutation,
  SelectTabMutationVariables
} from "./__generated__";

describe("client", () => {
  describe("configurator", () => {
    it("should allow a port to be selected", async () => {
      let { data } = await client.query<
        SelectedPortQuery,
        SelectedPortQueryVariables
      >({
        query: SelectedPortDocument
      });

      expect(data?.configurator.port).toEqual(null);

      await client.mutate<SelectPortMutation, SelectPortMutationVariables>({
        mutation: SelectPortDocument,
        variables: {
          port: "/a/test/port"
        }
      });

      ({ data } = await client.query<
        SelectedPortQuery,
        SelectedPortQueryVariables
      >({
        query: SelectedPortDocument
      }));

      expect(data?.configurator.port).toEqual("/a/test/port");
    });

    it("should allow tab to be selected", async () => {
      let { data } = await client.query<
        SelectedTabQuery,
        SelectedTabQueryVariables
      >({
        query: SelectedTabDocument
      });

      expect(data?.configurator.tab).toEqual(null);

      await client.mutate<SelectTabMutation, SelectTabMutationVariables>({
        mutation: SelectTabDocument,
        variables: {
          tabId: "some-tab"
        }
      });

      ({ data } = await client.query<
        SelectedTabQuery,
        SelectedTabQueryVariables
      >({
        query: SelectedTabDocument
      }));

      expect(data?.configurator.tab).toEqual("some-tab");
    });
  });
});
