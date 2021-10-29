import { VtxDeviceTypes } from "@betaflight/api";
import gql from "graphql-tag";
import { add } from "../../src/connections";
import { mockApi } from "../mocks";
import { createExecutor } from "../utils";

const client = createExecutor();

describe("device.vtx", () => {
  it("should return the vtx config of the device", async () => {
    mockApi.readVtxConfig.mockResolvedValue({
      type: VtxDeviceTypes.VTXDEV_SMARTAUDIO,
      band: 5,
      channel: 0,
      power: 0,
      pitMode: true,
      frequency: 0,
      deviceReady: false,
      lowPowerDisarm: 0,
      pitModeFrequency: 0,
      table: {
        available: true,
        numBands: 5,
        numBandChannels: 8,
        numPowerLevels: 5,
      },
    });

    add("/dev/someport", "connection-123");

    const { data, errors } = await client.query({
      query: gql`
        query {
          connection(connectionId: "connection-123") {
            device {
              vtx {
                type
                band
                channel
                power
                pitMode
                frequency
                deviceReady
                lowPowerDisarm
                pitModeFrequency
              }
            }
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data!.connection.device.vtx).toEqual({
      type: VtxDeviceTypes.VTXDEV_SMARTAUDIO,
      band: 5,
      channel: 0,
      power: 0,
      pitMode: true,
      frequency: 0,
      deviceReady: false,
      lowPowerDisarm: 0,
      pitModeFrequency: 0,
    });
  });

  describe("table", () => {
    it("should return null if the vtx table is unavailable", async () => {
      mockApi.readVtxConfig.mockResolvedValue({
        type: VtxDeviceTypes.VTXDEV_SMARTAUDIO,
        band: 5,
        channel: 0,
        power: 0,
        pitMode: true,
        frequency: 0,
        deviceReady: false,
        lowPowerDisarm: 0,
        pitModeFrequency: 0,
        table: {
          available: false,
          numBands: 0,
          numBandChannels: 0,
          numPowerLevels: 0,
        },
      });

      add("/dev/someport", "connection-123");

      const { data, errors } = await client.query({
        query: gql`
          query {
            connection(connectionId: "connection-123") {
              device {
                vtx {
                  table {
                    numBandChannels
                    numBands
                    numPowerLevels
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data!.connection.device.vtx.table).toBeNull();
    });

    it("should return the table rows based on the table config", async () => {
      mockApi.readVtxConfig.mockResolvedValue({
        type: VtxDeviceTypes.VTXDEV_SMARTAUDIO,
        band: 5,
        channel: 0,
        power: 0,
        pitMode: true,
        frequency: 0,
        deviceReady: false,
        lowPowerDisarm: 0,
        pitModeFrequency: 0,
        table: {
          available: true,
          numBands: 3,
          numBandChannels: 5,
          numPowerLevels: 4,
        },
      });

      const bandRows = new Array(3).fill(1).map((_, index) => ({
        id: index + 1,
        name: `Some_Name_${1}`,
        isFactoryBand: false,
        letter: index.toString(),
        frequencies: [1, 2, 3],
      }));
      bandRows.forEach((row) =>
        mockApi.readVtxTableBandsRow.mockResolvedValueOnce({
          ...row,
          rowNumber: row.id,
        })
      );

      const powerLevelRows = new Array(4).fill(1).map((_, index) => ({
        id: index + 1,
        label: `some-label-${1}`,
        value: index * 2,
      }));
      powerLevelRows.forEach((row) =>
        mockApi.readVtxTablePowerLevelsRow.mockResolvedValueOnce({
          ...row,
          rowNumber: row.id,
        })
      );

      add("/dev/someport", "connection-434");

      const { data, errors } = await client.query({
        query: gql`
          query {
            connection(connectionId: "connection-434") {
              device {
                vtx {
                  table {
                    bands {
                      id
                      name
                      isFactoryBand
                      letter
                      frequencies
                    }
                    powerLevels {
                      id
                      label
                      value
                    }
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data!.connection.device.vtx.table).toEqual({
        bands: bandRows,
        powerLevels: powerLevelRows,
      });
    });
  });
});
