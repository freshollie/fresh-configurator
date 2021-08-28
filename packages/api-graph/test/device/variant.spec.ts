import gql from "graphql-tag";
import { createExecutor } from "../utils";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const client = createExecutor();

afterEach(() => {
  reset();
});

describe("device.variant", () => {
  it("should return the fc variant of the device", async () => {
    mockApi.readFcVariant.mockResolvedValue("CLFL");

    add("/dev/hello", "bcd");

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
    expect(data?.connection.device.variant).toBe("CLFL");

    expect(mockApi.readFcVariant).toHaveBeenCalledWith("/dev/hello");
  });
});
