import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { createServer } from "../src";
import { mockApi } from "./mocks";

const { apolloServer } = createServer();

describe("ports", () => {
  it("should return the available ports", async () => {
    mockApi.ports.mockResolvedValue(["/dev/something", "/dev/anotherport"]);

    const { query } = createTestClient(apolloServer);

    const { data, errors } = await query({
      query: gql`
        query {
          ports
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.ports).toEqual(["/dev/something", "/dev/anotherport"]);
    expect(mockApi.ports).toHaveBeenCalled();
  });
});
