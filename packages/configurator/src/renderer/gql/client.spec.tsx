import { advanceTo, advanceBy } from "jest-date-mock";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { versionInfo } from "../util";
import { gql } from "./apollo";
import { createClient } from "./client";

const Logs = gql(/* GraphQL */ `
  query LogsTest {
    configurator @client {
      logs {
        message
        time
      }
    }
  }
`);

let client: ApolloClient<NormalizedCacheObject>;

const Log = gql(/* GraphQL */ `
  mutation LogTest($message: String!) {
    log(message: $message) @client
  }
`);

beforeAll(async () => {
  client = await createClient();
});

beforeEach(async () => {
  advanceTo(new Date("2020-03-01T19:00:00.000Z"));
  await client.resetStore();
});

describe("client", () => {
  describe("configurator", () => {
    it("should allow logs to be appended", async () => {
      let { data } = await client.query({
        query: Logs,
      });

      const initialMessage = {
        __typename: "Log",
        message: `Running - OS: <strong>Unknown</strong>, Chrome: <strong>4.0</strong>, Configurator: <strong>${
          versionInfo().version
        }</strong>`,
        time: "2020-03-01T19:00:00.000Z",
      };

      expect(data.configurator.logs).toEqual([initialMessage]);

      // Move time forward by 50 minutes
      advanceBy(60 * 1000 * 50);

      const response = await client.mutate({
        mutation: Log,
        variables: {
          message: "Some message to log",
        },
      });

      expect(response.errors).toBeFalsy();

      ({ data } = await client.query({
        query: Logs,
      }));

      expect(data.configurator.logs).toEqual([
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
