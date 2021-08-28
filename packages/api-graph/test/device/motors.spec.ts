import gql from "graphql-tag";
import { createExecutor } from "../utils";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const client = createExecutor();

afterEach(() => {
  reset();
});

describe("device.motors", () => {
  it("should provide the config for the motors", async () => {
    mockApi.readMixerConfig.mockResolvedValue({
      mixer: 2,
      reversedMotors: true,
    });
    mockApi.readAdvancedConfig.mockResolvedValue({
      digitalIdlePercent: 5.5,
    } as any);

    add("/dev/something", "abcd");

    const { data, errors } = await client.query({
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
    expect(mockApi.readAdvancedConfig).toHaveBeenCalledWith("/dev/something");
  });

  describe("setDeviceMotorsDirection", () => {
    it("should write the motor direction to the board", async () => {
      mockApi.writePartialMixerConfig.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { errors } = await client.mutate({
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
      expect(mockApi.writePartialMixerConfig).toHaveBeenCalledWith(
        "/dev/something",
        {
          reversedMotors: true,
        }
      );
    });
  });

  describe("deviceSetDigitalIdleSpeed", () => {
    it("should write the digital idle percentage to the baord", async () => {
      mockApi.writePartialAdvancedConfig.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { errors } = await client.mutate({
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
      expect(mockApi.writePartialAdvancedConfig).toHaveBeenCalledWith(
        "/dev/something",
        {
          digitalIdlePercent: 7.5,
        }
      );
    });
  });
});
