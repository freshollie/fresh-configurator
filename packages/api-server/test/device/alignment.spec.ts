import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { createServer } from "../../src";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const { apolloServer } = createServer();

afterEach(() => {
  reset();
});

describe("device.alignment", () => {
  it("should provide the board alignment config", async () => {
    mockApi.readBoardAlignmentConfig.mockResolvedValue({
      roll: 100,
      pitch: 200,
      yaw: -150,
    });
    add("/dev/something", "abcd");

    const { query } = createTestClient(apolloServer);

    const { data, errors } = await query({
      query: gql`
        query {
          connection(connectionId: "abcd") {
            device {
              alignment {
                roll
                pitch
                yaw
              }
            }
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.connection.device.alignment).toEqual({
      roll: 100,
      pitch: 200,
      yaw: -150,
    });
    expect(mockApi.readBoardAlignmentConfig).toHaveBeenCalledWith(
      "/dev/something"
    );
  });
});
