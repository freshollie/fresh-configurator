import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import server from "../src";
import { mockMsp } from "./mocks";

describe("ports", () => {
  it("should return the available ports", async () => {
    mockMsp.ports.mockResolvedValue(["/dev/something", "/dev/anotherport"]);

    const { query } = createTestClient(server);

    const { data, errors } = await query({
      query: gql`
        query {
          ports
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.ports).toEqual(["/dev/something", "/dev/anotherport"]);
    expect(mockMsp.ports).toHaveBeenCalled();
  });
});
