import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { createServer } from "../../src";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const { apolloServer } = createServer();

afterEach(() => {
  reset();
});

describe("device.name", () => {
  it("should return the name of the device", async () => {
    mockApi.readName.mockResolvedValue("oliver");

    add("/dev/device", "abc");

    const client = createTestClient(apolloServer);

    const { data, errors } = await client.query({
      query: gql`
        query {
          connection(connectionId: "abc") {
            device {
              name
            }
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data.connection.device.name).toBe("oliver");

    expect(mockApi.readName).toHaveBeenCalledWith("/dev/device");
  });
});
