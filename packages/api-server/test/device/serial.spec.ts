import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import { SerialPortFunctions } from "@betaflight/api";
import { createServer } from "../../src";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const { apolloServer } = createServer();

afterEach(() => {
  reset();
});

describe("device.serial", () => {
  it("should respond with the serial settings on the device", async () => {
    mockApi.readSerialConfig.mockResolvedValue({
      ports: [
        {
          id: 0,
          functions: [SerialPortFunctions.BLACKBOX],
          blackboxBaudRate: 1111,
          mspBaudRate: 2222,
          gpsBaudRate: 3333,
          telemetryBaudRate: 4444,
        },
      ],
    });
    add("/dev/something", "abcd");

    const { query } = createTestClient(apolloServer);

    const { data, errors } = await query({
      query: gql`
        query {
          connection(connectionId: "abcd") {
            device {
              serial {
                ports {
                  id
                  functions
                  blackboxBaudRate
                  mspBaudRate
                  gpsBaudRate
                  telemetryBaudRate
                }
              }
            }
          }
        }
      `,
    });

    expect(errors).toBeFalsy();
    expect(data?.connection.device.serial).toEqual({
      ports: [
        {
          id: 0,
          functions: [SerialPortFunctions.BLACKBOX],
          blackboxBaudRate: 1111,
          mspBaudRate: 2222,
          gpsBaudRate: 3333,
          telemetryBaudRate: 4444,
        },
      ],
    });
    expect(mockApi.readSerialConfig).toHaveBeenCalledWith("/dev/something");
  });
});
