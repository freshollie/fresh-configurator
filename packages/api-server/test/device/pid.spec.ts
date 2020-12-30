import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { createServer } from "../../src";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const { apolloServer } = createServer();

afterEach(() => {
  reset();
});

describe("device.pid", () => {
  describe("protocols", () => {
    it("should provide the pid protocols config", async () => {
      const advancedConfig = {
        gyroSyncDenom: 3,
        pidProcessDenom: 2,
        useUnsyncedPwm: false,
        fastPwmProtocol: 1,
        gyroToUse: 0,
        motorPwmRate: 480,
        digitalIdlePercent: 4.5,
        gyroUse32kHz: false,
        motorPwmInversion: 0,
        gyroHighFsr: 0,
        gyroMovementCalibThreshold: 0,
        gyroCalibDuration: 0,
        gyroOffsetYaw: 0,
        gyroCheckOverflow: 0,
        debugMode: 0,
        debugModeCount: 0,
      };
      mockApi.readAdvancedPidConfig.mockResolvedValue(advancedConfig);
      add("/dev/something", "someconnectionid");

      const { query } = createTestClient(apolloServer);

      const { data, errors } = await query({
        query: gql`
          query {
            connection(connectionId: "someconnectionid") {
              device {
                pid {
                  protocols {
                    gyroSyncDenom
                    gyroUse32kHz
                    useUnsyncedPwm
                    fastPwmProtocol
                    motorPwmRate
                    pidProcessDenom
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.pid.protocols).toEqual({
        gyroSyncDenom: advancedConfig.gyroSyncDenom,
        gyroUse32kHz: advancedConfig.gyroUse32kHz,
        useUnsyncedPwm: advancedConfig.useUnsyncedPwm,
        fastPwmProtocol: advancedConfig.fastPwmProtocol,
        motorPwmRate: advancedConfig.motorPwmRate,
        pidProcessDenom: advancedConfig.pidProcessDenom,
      });
      expect(mockApi.readAdvancedPidConfig).toHaveBeenCalledWith(
        "/dev/something"
      );
    });
  });

  describe("deviceSetPidProtocols", () => {
    it("should write given pid protocols to the device", async () => {
      add("/dev/somedevice", "abcd");

      const { mutate } = createTestClient(apolloServer);
      mockApi.writePidProtocols.mockResolvedValue(undefined);

      const { errors } = await mutate({
        mutation: gql`
          mutation SetPidProtocols(
            $connectionId: ID!
            $protocols: PidProtocolsInput!
          ) {
            deviceSetPidProtocols(
              connectionId: $connectionId
              protocols: $protocols
            )
          }
        `,
        variables: {
          connectionId: "abcd",
          protocols: {
            fastPwmProtocol: 9000,
            pidProcessDenom: 1,
            gyroUse32kHz: false,
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writePidProtocols).toHaveBeenCalledWith(
        "/dev/somedevice",
        {
          fastPwmProtocol: 9000,
          pidProcessDenom: 1,
          gyroUse32kHz: false,
        }
      );
    });
  });
});
