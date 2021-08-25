import { Features } from "@betaflight/api";
import gql from "graphql-tag";
import { createServer } from "../../src";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const { apolloServer } = createServer();

afterEach(() => {
  reset();
});

describe("device.features", () => {
  it("should return the list of enabled device features", async () => {
    mockApi.readEnabledFeatures.mockResolvedValue([
      Features.SOFTSERIAL,
      Features.TRANSPONDER,
      Features.RX_SPI,
    ]);
    add("/dev/something", "testconnectionId");

    const { errors, data } = await apolloServer.executeOperation({
      query: gql`
        query {
          connection(connectionId: "testconnectionId") {
            device {
              features
            }
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.connection.device.features).toEqual([
      Features.SOFTSERIAL,
      Features.TRANSPONDER,
      Features.RX_SPI,
    ]);
    expect(mockApi.readEnabledFeatures).toHaveBeenCalledWith("/dev/something");
  });

  describe("deviceSetReceiverMode", () => {
    it("should set the board features to the provided list", async () => {
      mockApi.writeEnabledFeatures.mockResolvedValue();
      mockApi.readEnabledFeatures.mockResolvedValue([
        Features.SOFTSERIAL,
        Features.TRANSPONDER,
        Features.RX_SPI,
      ]);
      add("/dev/something", "testconnectionId");

      const { errors } = await apolloServer.executeOperation({
        query: gql`
          mutation SetReceiverMode($connection: ID!, $features: [Int!]!) {
            deviceSetFeatures(connectionId: $connection, features: $features)
          }
        `,
        variables: {
          connection: "testconnectionId",
          features: [Features.SOFTSERIAL, Features.TRANSPONDER],
        },
      });

      expect(errors).toBeFalsy();
      expect(
        mockApi.writeEnabledFeatures
      ).toHaveBeenCalledWith("/dev/something", [
        Features.SOFTSERIAL,
        Features.TRANSPONDER,
      ]);
    });
  });
});
