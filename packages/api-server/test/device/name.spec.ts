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

    const { data, errors } = await apolloServer.executeOperation({
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
