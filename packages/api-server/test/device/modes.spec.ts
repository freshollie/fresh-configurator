import { Modes } from "@betaflight/api";
import gql from "graphql-tag";
import { createServer } from "../../src";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const { apolloServer } = createServer();

afterEach(() => {
  reset();
});

describe("device.modes", () => {
  describe("available", () => {
    it("should provide a list of available mode ids", async () => {
      mockApi.readBoxIds.mockResolvedValue([0, 1, 2]);
      add("/dev/something", "testconnectionId");

      const { errors, data } = await apolloServer.executeOperation({
        query: gql`
          query {
            connection(connectionId: "testconnectionId") {
              device {
                modes {
                  available
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.modes.available).toEqual([0, 1, 2]);
      expect(mockApi.readBoxIds).toHaveBeenCalledWith("/dev/something");
    });
  });

  describe("slots", () => {
    it("should return the list of mode range slots", async () => {
      mockApi.readModeRangeSlots.mockResolvedValue([
        {
          modeId: 0,
          auxChannel: 3,
          range: { start: 1300, end: 1700 },
          linkedTo: 1,
          modeLogic: 1,
        },
        {
          modeId: 0,
          auxChannel: 3,
          range: { start: 1300, end: 1750 },
          linkedTo: 1,
          modeLogic: 1,
        },
      ]);
      add("/dev/something", "testconnectionId2");

      const { errors, data } = await apolloServer.executeOperation({
        query: gql`
          query {
            connection(connectionId: "testconnectionId2") {
              device {
                modes {
                  slots {
                    id
                    modeId
                    modeLogic
                    range {
                      start
                      end
                    }
                    linkedTo
                    auxChannel
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.modes.slots).toEqual([
        {
          id: 0,
          modeId: 0,
          auxChannel: 3,
          range: { start: 1300, end: 1700 },
          linkedTo: 1,
          modeLogic: 1,
        },
        {
          id: 1,
          modeId: 0,
          auxChannel: 3,
          range: { start: 1300, end: 1750 },
          linkedTo: 1,
          modeLogic: 1,
        },
      ]);
    });

    it("should return handle no extra data being available", async () => {
      mockApi.readModeRangeSlots.mockResolvedValue([
        {
          modeId: 12,
          auxChannel: 3,
          range: { start: 900, end: 1700 },
        },
        {
          modeId: 10,
          auxChannel: 3,
          range: { start: 1300, end: 1750 },
        },
      ]);
      add("/dev/something", "testconnectionId2");

      const { errors, data } = await apolloServer.executeOperation({
        query: gql`
          query {
            connection(connectionId: "testconnectionId2") {
              device {
                modes {
                  slots {
                    id
                    modeId
                    modeLogic
                    range {
                      start
                      end
                    }
                    linkedTo
                    auxChannel
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.modes.slots).toEqual([
        {
          id: 0,
          modeId: 12,
          auxChannel: 3,
          range: { start: 900, end: 1700 },
          linkedTo: null,
          modeLogic: null,
        },
        {
          id: 1,
          modeId: 10,
          auxChannel: 3,
          range: { start: 1300, end: 1750 },
          linkedTo: null,
          modeLogic: null,
        },
      ]);
    });
  });

  describe("slot", () => {
    it("should return the mode slot of the specified id", async () => {
      mockApi.readModeRangeSlots.mockResolvedValue([
        {
          modeId: 0,
          auxChannel: 3,
          range: { start: 1300, end: 1700 },
          linkedTo: 1,
          modeLogic: 1,
        },
        {
          modeId: 0,
          auxChannel: 3,
          range: { start: 1300, end: 1750 },
          linkedTo: 1,
          modeLogic: 1,
        },
      ]);
      add("/dev/something", "testconnectionId2");

      const { errors, data } = await apolloServer.executeOperation({
        query: gql`
          query {
            connection(connectionId: "testconnectionId2") {
              device {
                modes {
                  slot(id: 1) {
                    id
                    modeId
                    modeLogic
                    range {
                      start
                      end
                    }
                    linkedTo
                    auxChannel
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.modes.slot).toEqual({
        id: 1,
        modeId: 0,
        auxChannel: 3,
        range: { start: 1300, end: 1750 },
        linkedTo: 1,
        modeLogic: 1,
      });
    });

    it("should return handle no slot of the given id", async () => {
      mockApi.readModeRangeSlots.mockResolvedValue([
        {
          modeId: 0,
          auxChannel: 3,
          range: { start: 1300, end: 1700 },
          linkedTo: 1,
          modeLogic: 1,
        },
        {
          modeId: 0,
          auxChannel: 3,
          range: { start: 1300, end: 1750 },
          linkedTo: 1,
          modeLogic: 1,
        },
      ]);
      add("/dev/something", "testconnectionId2");

      const { errors, data } = await apolloServer.executeOperation({
        query: gql`
          query {
            connection(connectionId: "testconnectionId2") {
              device {
                modes {
                  slot(id: 100) {
                    id
                    modeId
                    modeLogic
                    range {
                      start
                      end
                    }
                    linkedTo
                    auxChannel
                  }
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data?.connection.device.modes.slot).toEqual(null);
    });
  });

  describe("deviceSetModeRangeSlot", () => {
    it("should set the mode logic for the given slot", async () => {
      mockApi.writeModeRangeSlot.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { errors } = await apolloServer.executeOperation({
        query: gql`
          mutation SetModeRangeSlot(
            $connection: ID!
            $slotId: Int!
            $config: ModeSlotConfig!
          ) {
            deviceSetModeSlotConfig(
              connectionId: $connection
              slotId: $slotId
              config: $config
            )
          }
        `,
        variables: {
          connection: "testconnectionId",
          slotId: 1,
          config: {
            modeId: Modes.FAILSAFE,
            auxChannel: 10,
            range: { start: 900, end: 2100 },
            linkedTo: 1,
            modeLogic: 1,
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeModeRangeSlot).toHaveBeenCalledWith(
        "/dev/something",
        1,
        {
          modeId: Modes.FAILSAFE,
          auxChannel: 10,
          range: { start: 900, end: 2100 },
          linkedTo: 1,
          modeLogic: 1,
        }
      );
    });

    it("should handle no extra information provided", async () => {
      mockApi.writeModeRangeSlot.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { errors } = await apolloServer.executeOperation({
        query: gql`
          mutation SetModeRangeSlot(
            $connection: ID!
            $slotId: Int!
            $config: ModeSlotConfig!
          ) {
            deviceSetModeSlotConfig(
              connectionId: $connection
              slotId: $slotId
              config: $config
            )
          }
        `,
        variables: {
          connection: "testconnectionId",
          slotId: 1,
          config: {
            modeId: Modes.FPV_ANGLE_MIX,
            auxChannel: 10,
            range: { start: 900, end: 2100 },
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeModeRangeSlot).toHaveBeenCalledWith(
        "/dev/something",
        1,
        {
          modeId: Modes.FPV_ANGLE_MIX,
          auxChannel: 10,
          range: { start: 900, end: 2100 },
        }
      );
    });
  });
});
