import { Sensors } from "@betaflight/api";
import gql from "graphql-tag";
import { createExecutor } from "../utils";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const client = createExecutor();

afterEach(() => {
  reset();
});

describe("device.sensors", () => {
  describe("disabled", () => {
    it("should the list of disabled sensors", async () => {
      mockApi.readDisabledSensors.mockResolvedValue([
        Sensors.ACCELEROMETER,
        Sensors.MAGNETOMETER,
      ]);
      add("/dev/something", "abcd");

      const { data, errors } = await client.query({
        query: gql`
          query {
            connection(connectionId: "abcd") {
              device {
                sensors {
                  disabled
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.sensors.disabled).toEqual([
        Sensors.ACCELEROMETER,
        Sensors.MAGNETOMETER,
      ]);
      expect(mockApi.readDisabledSensors).toHaveBeenCalledWith(
        "/dev/something"
      );
    });
  });

  describe("setDeviceDisabledSensors", () => {
    it("should set the disabled sensors for the device", async () => {
      mockApi.writeDisabledSensors.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetDisabledSensors(
            $connection: ID!
            $disabledSensors: [Int!]!
          ) {
            deviceSetDisabledSensors(
              connectionId: $connection
              disabledSensors: $disabledSensors
            )
          }
        `,
        variables: {
          connection: "testconnectionId",
          disabledSensors: [Sensors.ACCELEROMETER],
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeDisabledSensors).toHaveBeenCalledWith(
        "/dev/something",
        [Sensors.ACCELEROMETER]
      );
    });
  });
});
