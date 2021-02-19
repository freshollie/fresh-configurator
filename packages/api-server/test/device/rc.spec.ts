import {
  RcSmoothingDerivativeTypes,
  RcSmoothingInputTypes,
  RcSmoothingTypes,
  SerialRxProviders,
  SpiRxProtocols,
} from "@betaflight/api";
import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { createServer } from "../../src";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const { apolloServer } = createServer();

afterEach(() => {
  reset();
});

describe("device.rc", () => {
  describe("receiver", () => {
    it("should provide the config for the receiver", async () => {
      mockApi.readRxConfig.mockResolvedValue({
        serialProvider: SerialRxProviders.CRSF,
        spi: {
          protocol: SpiRxProtocols.FRSKY_D,
        },
      } as any);

      add("/dev/something", "abcd");

      const { query } = createTestClient(apolloServer);

      const { data, errors } = await query({
        query: gql`
          query {
            connection(connectionId: "abcd") {
              device {
                rc {
                  receiver {
                    serialProvider
                    spi {
                      protocol
                    }
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.rc.receiver).toEqual({
        serialProvider: SerialRxProviders.CRSF,
        spi: {
          protocol: SpiRxProtocols.FRSKY_D,
        },
      });
      expect(mockApi.readRxConfig).toHaveBeenCalledWith("/dev/something");
    });
  });

  describe("smoothing", () => {
    it("should provide the config for the rcSmoothing", async () => {
      mockApi.readRxConfig.mockResolvedValue({
        rcSmoothing: {
          autoSmoothness: 0,
          channels: 2,
          derivativeCutoff: 0,
          derivativeType: RcSmoothingDerivativeTypes.BIQUAD,
          inputCutoff: 0,
          inputType: RcSmoothingInputTypes.BIQUAD,
          type: RcSmoothingTypes.INTERPOLATION,
        },
      } as any);

      add("/dev/something", "abcd");

      const { query } = createTestClient(apolloServer);

      const { data, errors } = await query({
        query: gql`
          query {
            connection(connectionId: "abcd") {
              device {
                rc {
                  smoothing {
                    autoSmoothness
                    channels
                    derivativeCutoff
                    derivativeType
                    inputCutoff
                    inputType
                    type
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.rc.smoothing).toEqual({
        autoSmoothness: 0,
        channels: 2,
        derivativeCutoff: 0,
        derivativeType: RcSmoothingDerivativeTypes.BIQUAD,
        inputCutoff: 0,
        inputType: RcSmoothingInputTypes.BIQUAD,
        type: RcSmoothingTypes.INTERPOLATION,
      });
      expect(mockApi.readRxConfig).toHaveBeenCalledWith("/dev/something");
    });
  });

  describe("setDeviceReceiverConfig", () => {
    it("should write the receiver config to the board", async () => {
      mockApi.writePartialRxConfig.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { mutate } = createTestClient(apolloServer);

      const { errors } = await mutate({
        mutation: gql`
          mutation SetRxConfig($connection: ID!, $config: RxConfigInput!) {
            deviceSetReceiverConfig(
              connectionId: $connection
              receiverConfig: $config
            )
          }
        `,
        variables: {
          connection: "testconnectionId",
          config: {
            serialProvider: SerialRxProviders.SBUS,
            spi: {
              protocol: SpiRxProtocols.SFHSS,
            },
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writePartialRxConfig).toHaveBeenCalledWith(
        "/dev/something",
        {
          serialProvider: SerialRxProviders.SBUS,
          spi: {
            protocol: SpiRxProtocols.SFHSS,
          },
        }
      );
    });
  });

  describe("deviceSetRcSmootingConfig", () => {
    it("should write the digital idle percentage to the baord", async () => {
      mockApi.writePartialRxConfig.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { mutate } = createTestClient(apolloServer);

      const { errors } = await mutate({
        mutation: gql`
          mutation SetRcSmoothingConfig(
            $connection: ID!
            $config: RcSmoothingInput!
          ) {
            deviceSetRcSmoothingConfig(
              connectionId: $connection
              smoothingConfig: $config
            )
          }
        `,
        variables: {
          connection: "testconnectionId",
          config: {
            type: RcSmoothingTypes.INTERPOLATION,
            channels: 5,
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writePartialRxConfig).toHaveBeenCalledWith(
        "/dev/something",
        {
          rcSmoothing: {
            type: RcSmoothingTypes.INTERPOLATION,
            channels: 5,
          },
        }
      );
    });
  });
});
