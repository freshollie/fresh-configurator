import {
  RcSmoothingDerivativeTypes,
  RcSmoothingInputTypes,
  RcSmoothingTypes,
  SerialRxProviders,
  SpiRxProtocols,
} from "@betaflight/api";
import gql from "graphql-tag";
import { createExecutor } from "../utils";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const client = createExecutor();

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

      mockApi.readRxMap.mockResolvedValue([
        "A",
        "E",
        "T",
        "R",
        "1",
        "2",
        "3",
        "4",
      ]);

      add("/dev/something", "abcd");

      const { data, errors } = await client.query({
        query: gql`
          query {
            connection(connectionId: "abcd") {
              device {
                rc {
                  receiver {
                    channelMap
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
        channelMap: ["A", "E", "T", "R", "1", "2", "3", "4"],
      });
      expect(mockApi.readRxConfig).toHaveBeenCalledWith("/dev/something");
      expect(mockApi.readRxMap).toHaveBeenCalledWith("/dev/something");
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

      const { data, errors } = await client.query({
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

  describe("rssi", () => {
    it("should provide the rssi receiver data", async () => {
      mockApi.readRssiConfig.mockResolvedValue({
        channel: 3,
      });
      mockApi.readAnalogValues.mockResolvedValue({
        rssi: 50,
      } as any);

      add("/dev/something", "abcd");

      const { data, errors } = await client.query({
        query: gql`
          query {
            connection(connectionId: "abcd") {
              device {
                rc {
                  rssi {
                    channel
                    value
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.rc.rssi).toEqual({
        value: 50,
        channel: 3,
      });
      expect(mockApi.readRssiConfig).toHaveBeenCalledWith("/dev/something");
      expect(mockApi.readAnalogValues).toHaveBeenCalledWith("/dev/something");
    });
  });

  describe("setDeviceReceiverConfig", () => {
    it("should write the receiver config to the board", async () => {
      mockApi.writePartialRxConfig.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { errors } = await client.mutate({
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

      const { errors } = await client.mutate({
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

  describe("deviceSetChannelMap", () => {
    it("should write the rx channel map to the board", async () => {
      mockApi.writeRxMap.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetChannelMap($connection: ID!, $map: [ID!]!) {
            deviceSetChannelMap(connectionId: $connection, channelMap: $map)
          }
        `,
        variables: {
          connection: "testconnectionId",
          map: ["A", "E", "T", "R", "1", "2", "3", "4"],
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeRxMap).toHaveBeenCalledWith("/dev/something", [
        "A",
        "E",
        "T",
        "R",
        "1",
        "2",
        "3",
        "4",
      ]);
    });

    it("should throw an error if a map value is not valid", async () => {
      mockApi.writeRxMap.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetChannelMap($connection: ID!, $map: [ID!]!) {
            deviceSetChannelMap(connectionId: $connection, channelMap: $map)
          }
        `,
        variables: {
          connection: "testconnectionId",
          map: ["A", "E", "T", "F", "1", "2", "3", "G"],
        },
      });

      expect(errors).toMatchInlineSnapshot(`
        Array [
          [GraphQLError: Invalid channel value: F],
        ]
      `);
    });

    it("should throw an error if full map is not given", async () => {
      mockApi.writeRxMap.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetChannelMap($connection: ID!, $map: [ID!]!) {
            deviceSetChannelMap(connectionId: $connection, channelMap: $map)
          }
        `,
        variables: {
          connection: "testconnectionId",
          map: ["A", "E", "T", "R"],
        },
      });

      expect(errors).toMatchInlineSnapshot(`
        Array [
          [GraphQLError: Channel map must be at least 8],
        ]
      `);
    });
  });

  describe("deviceSetRssiChannel", () => {
    it("should write the rssi channel to the board", async () => {
      mockApi.writeRssiConfig.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetRssiChannel($connection: ID!, $channel: Int!) {
            deviceSetRssiChannel(connectionId: $connection, channel: $channel)
          }
        `,
        variables: {
          connection: "testconnectionId",
          channel: 4,
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeRssiConfig).toHaveBeenCalledWith("/dev/something", {
        channel: 4,
      });
    });
  });
});
