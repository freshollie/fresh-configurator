import gql from "graphql-tag";
import { createExecutor } from "../utils";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const client = createExecutor();

afterEach(() => {
  reset();
});

describe("device.name", () => {
  it("should return the name of the device", async () => {
    mockApi.readName.mockResolvedValue("oliver");

    add("/dev/device", "abc");

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
    expect(data?.connection.device.name).toBe("oliver");

    expect(mockApi.readName).toHaveBeenCalledWith("/dev/device");
  });
});
