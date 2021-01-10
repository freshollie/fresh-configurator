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
    mockApi.readAdvancedPidConfig.mockResolvedValue({
      digitalIdlePercent: 5.5,
    } as any);

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
                digitalIdlePercent
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
      digitalIdlePercent: 5.5,
    });
    expect(mockApi.readMixerConfig).toHaveBeenCalledWith("/dev/something");
    expect(mockApi.readAdvancedPidConfig).toHaveBeenCalledWith(
      "/dev/something"
    );
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

  describe("deviceSetDigitalIdleSpeed", () => {
    it("should write the digital idle percentage to the baord", async () => {
      mockApi.writeDigitalIdleSpeed.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { mutate } = createTestClient(apolloServer);

      const { errors } = await mutate({
        mutation: gql`
          mutation SetMotorsDirection(
            $connection: ID!
            $idlePercentage: Float!
          ) {
            deviceSetDigitalIdleSpeed(
              connectionId: $connection
              idlePercentage: $idlePercentage
            )
          }
        `,
        variables: {
          connection: "testconnectionId",
          idlePercentage: 7.5,
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeDigitalIdleSpeed).toHaveBeenCalledWith(
        "/dev/something",
        7.5
      );
    });
  });
});
