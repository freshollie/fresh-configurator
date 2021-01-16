import { Beepers } from "@betaflight/api";
import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { createServer } from "../../src";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const { apolloServer } = createServer();

afterEach(() => {
  reset();
});

describe("device.beeper", () => {
  it("should provide the beeper config", async () => {
    mockApi.readBeeperConfig.mockResolvedValue({
      conditions: [Beepers.ARMED, Beepers.BLACKBOX_ERASE],
      dshot: {
        tone: 5,
        conditions: [Beepers.RX_SET, Beepers.RX_LOST],
      },
    });
    add("/dev/something", "abcd");

    const { query } = createTestClient(apolloServer);

    const { data, errors } = await query({
      query: gql`
        query {
          connection(connectionId: "abcd") {
            device {
              beeper {
                conditions
                dshot {
                  tone
                  conditions
                }
              }
            }
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.connection.device.beeper).toEqual({
      conditions: [Beepers.ARMED, Beepers.BLACKBOX_ERASE],
      dshot: {
        tone: 5,
        conditions: [Beepers.RX_SET, Beepers.RX_LOST],
      },
    });
    expect(mockApi.readBeeperConfig).toHaveBeenCalledWith("/dev/something");
  });

  describe("setDeviceDshotBeeperConfig", () => {
    it("should set the dshot beeper config for the device", async () => {
      mockApi.writeDshotBeeperConfig.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const { mutate } = createTestClient(apolloServer);

      const { errors } = await mutate({
        mutation: gql`
          mutation SetDshotBeeperConfig(
            $connection: ID!
            $config: DshotBeeperConfigInput!
          ) {
            deviceSetDshotBeeperConfig(
              connectionId: $connection
              config: $config
            )
          }
        `,
        variables: {
          connection: "testconnectionId",
          config: {
            tone: 3,
            conditions: [Beepers.RX_SET],
          },
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeDshotBeeperConfig).toHaveBeenCalledWith(
        "/dev/something",
        {
          tone: 3,
          conditions: [Beepers.RX_SET],
        }
      );
    });
  });
});
