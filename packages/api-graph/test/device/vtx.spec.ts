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
    expect(mockApi.readVtxConfig).toHaveBeenCalledWith("/dev/someport");
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

  describe("deviceSetVtxTable", () => {
    it("should write the vtx config with any of the provided values", async () => {
      add("/dev/another-port", "hello-123");
      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetVtxConfig {
            deviceSetVtxConfig(
              connectionId: "hello-123"
              vtxConfig: { channel: 12, type: 4, frequency: 60 }
            )
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writePartialVtxConfig).toHaveBeenCalledWith(
        "/dev/another-port",
        {
          channel: 12,
          type: VtxDeviceTypes.VTXDEV_TRAMP,
          frequency: 60,
        }
      );
    });

    it("should write values from the vtx table", async () => {
      add("/dev/another-port", "hello-123");
      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetVtxConfig {
            deviceSetVtxConfig(
              connectionId: "hello-123"
              vtxConfig: {
                table: {
                  bands: [
                    {
                      id: 1
                      isFactoryBand: true
                      letter: "A"
                      name: "Band A"
                      frequencies: [1, 2, 3]
                    }
                    {
                      id: 2
                      isFactoryBand: true
                      letter: "B"
                      name: "Band B"
                      frequencies: [5, 6, 7]
                    }
                  ]
                  powerLevels: [
                    { id: 1, label: "Label 1", value: 1 }
                    { id: 2, label: "Label 2", value: 2 }
                  ]
                  numBandChannels: 8
                }
              }
            )
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writePartialVtxConfig).toHaveBeenCalledWith(
        "/dev/another-port",
        {
          table: { numBandChannels: 8, numBands: 2, numPowerLevels: 2 },
        }
      );

      [
        {
          rowNumber: 1,
          id: 1,
          isFactoryBand: true,
          letter: "A",
          name: "Band A",
          frequencies: [1, 2, 3],
        },
        {
          rowNumber: 2,
          id: 2,
          isFactoryBand: true,
          letter: "B",
          name: "Band B",
          frequencies: [5, 6, 7],
        },
      ].forEach((row) =>
        expect(mockApi.writeVtxTableBandsRow).toHaveBeenCalledWith(
          "/dev/another-port",
          row
        )
      );

      [
        { rowNumber: 1, id: 1, label: "Label 1", value: 1 },
        { rowNumber: 2, id: 2, label: "Label 2", value: 2 },
      ].forEach((row) =>
        expect(mockApi.writeVtxTablePowerLevelsRow).toHaveBeenCalledWith(
          "/dev/another-port",
          row
        )
      );
    });
  });

  describe("deviceSetVtxTablePowerLevelsRow", () => {
    it("should set the vtx table power levels row", async () => {
      mockApi.writeVtxTablePowerLevelsRow.mockResolvedValue();
      add("/dev/some-port", "abcd");
      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetVtxTablePowerLevelRow {
            deviceSetVtxTablePowerLevelsRow(
              connectionId: "abcd"
              powerLevelsRow: { id: 2, label: "Label 2", value: 2 }
            )
          }
        `,
      });
      expect(errors).toBeFalsy();
      expect(mockApi.writeVtxTablePowerLevelsRow).toHaveBeenCalledWith(
        "/dev/some-port",
        { rowNumber: 2, id: 2, label: "Label 2", value: 2 }
      );
    });
  });

  describe("deviceSetVtxTableBandsRow", () => {
    it("should set the vtx table bands row", async () => {
      mockApi.writeVtxTableBandsRow.mockResolvedValue();
      add("/dev/some-port", "abcd");
      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetVtxTableBandsRow {
            deviceSetVtxTableBandsRow(
              connectionId: "abcd"
              bandsRow: {
                id: 1
                isFactoryBand: true
                letter: "A"
                name: "Band A"
                frequencies: [1, 2, 3]
              }
            )
          }
        `,
      });
      expect(errors).toBeFalsy();
      expect(mockApi.writeVtxTableBandsRow).toHaveBeenCalledWith(
        "/dev/some-port",
        {
          rowNumber: 1,
          id: 1,
          isFactoryBand: true,
          letter: "A",
          name: "Band A",
          frequencies: [1, 2, 3],
        }
      );
    });
  });

  describe("deviceClearVtxTable", () => {
    it("should clear the vtx table", async () => {
      mockApi.clearVtxTable.mockResolvedValue();
      add("/dev/another", "hello-567");

      const { errors } = await client.mutate({
        mutation: gql`
          mutation ClearVtxTable {
            deviceClearVtxTable(connectionId: "hello-567")
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(mockApi.clearVtxTable).toHaveBeenCalledWith("/dev/another");
    });
  });
});
