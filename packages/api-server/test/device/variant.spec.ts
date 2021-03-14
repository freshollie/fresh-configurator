import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { createServer } from "../../src";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const { apolloServer } = createServer();

afterEach(() => {
  reset();
});

describe("device.variant", () => {
  it("should return the fc variant of the device", async () => {
    mockApi.readFcVariant.mockResolvedValue("CLFL");

    add("/dev/hello", "bcd");

    const client = createTestClient(apolloServer);

    const { data, errors } = await client.query({
      query: gql`
        query {
          connection(connectionId: "bcd") {
            device {
              variant
            }
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data.connection.device.variant).toBe("CLFL");

    expect(mockApi.readFcVariant).toHaveBeenCalledWith("/dev/hello");
  });
});
