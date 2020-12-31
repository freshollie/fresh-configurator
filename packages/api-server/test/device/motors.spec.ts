import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { createServer } from "../../src";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const { apolloServer } = createServer();

afterEach(() => {
  reset();
});

describe("device.motors", () => {
  it("should provide the config for the motors", async () => {
    mockApi.readMixerConfig.mockResolvedValue({
      mixer: 2,
      reversedMotors: true,
    });
    add("/dev/something", "abcd");

    const { query } = createTestClient(apolloServer);

    const { data, errors } = await query({
      query: gql`
        query {
          connection(connectionId: "abcd") {
            device {
              motors {
                mixer
                reversedDirection
              }
            }
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.connection.device.motors).toEqual({
      mixer: 2,
      reversedDirection: true,
    });
    expect(mockApi.readMixerConfig).toHaveBeenCalledWith("/dev/something");
  });

  describe("setDeviceMotorsDirection", () => {
    it("should write the motor direction to the board", async () => {
      mockApi.writeMotorDirection.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { mutate } = createTestClient(apolloServer);

      const { errors } = await mutate({
        mutation: gql`
          mutation SetMotorsDirection($connection: ID!, $reversed: Boolean!) {
            deviceSetMotorsDirection(
              connectionId: $connection
              reversed: $reversed
            )
          }
        `,
        variables: {
          connection: "testconnectionId",
          reversed: true,
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeMotorDirection).toHaveBeenCalledWith(
        "/dev/something",
        true
      );
    });
  });
});
