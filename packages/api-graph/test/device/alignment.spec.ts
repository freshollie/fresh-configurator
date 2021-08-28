import gql from "graphql-tag";
import { createExecutor } from "../utils";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const client = createExecutor();

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

    const { data, errors } = await client.query({
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
