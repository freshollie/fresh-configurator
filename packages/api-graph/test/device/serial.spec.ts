import gql from "graphql-tag";
import { SerialPortFunctions } from "@betaflight/api";
import { createExecutor } from "../utils";
import { add, reset } from "../../src/connections";
import { mockApi } from "../mocks";

const client = createExecutor();

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

    const { data, errors } = await client.query({
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

  describe("setSerialFunctions", () => {
    it("should set the functions for the provided serial ports", async () => {
      mockApi.readSerialConfig.mockResolvedValue({
        legacy: {
          mspBaudRate: 0,
          cliBaudRate: 0,
          gpsBaudRate: 0,
          gpsPassthroughBaudRate: 0,
        },
        ports: [
          {
            id: 0,
            functions: [SerialPortFunctions.MSP],
            mspBaudRate: 0,
            gpsBaudRate: 0,
            telemetryBaudRate: 0,
            blackboxBaudRate: 0,
          },
          {
            id: 1,
            functions: [
              SerialPortFunctions.IRC_TRAMP,
              SerialPortFunctions.RX_SERIAL,
            ],
            mspBaudRate: 0,
            gpsBaudRate: 0,
            telemetryBaudRate: 0,
            blackboxBaudRate: 0,
          },
          {
            id: 2,
            functions: [SerialPortFunctions.TELEMETRY_IBUS],
            mspBaudRate: 0,
            gpsBaudRate: 0,
            telemetryBaudRate: 0,
            blackboxBaudRate: 0,
          },
        ],
      });
      mockApi.writeSerialConfig.mockResolvedValue();
      add("/dev/something", "testconnectionId");

      const newFunctions = [
        {
          id: 0,
          functions: [SerialPortFunctions.ESC_SENSOR],
        },
        {
          id: 1,
          functions: [SerialPortFunctions.GPS],
        },
      ];

      const { errors } = await client.mutate({
        mutation: gql`
          mutation SetSerialFunctions(
            $connection: ID!
            $portFunctions: [PortFunctionsInput!]!
          ) {
            deviceSetSerialFunctions(
              connectionId: $connection
              portFunctions: $portFunctions
            )
          }
        `,
        variables: {
          connection: "testconnectionId",
          portFunctions: newFunctions,
        },
      });

      expect(errors).toBeFalsy();
      expect(mockApi.writeSerialConfig).toHaveBeenCalledWith("/dev/something", {
        legacy: {
          mspBaudRate: 0,
          cliBaudRate: 0,
          gpsBaudRate: 0,
          gpsPassthroughBaudRate: 0,
        },
        ports: [
          {
            id: 0,
            functions: [SerialPortFunctions.ESC_SENSOR],
            mspBaudRate: 0,
            gpsBaudRate: 0,
            telemetryBaudRate: 0,
            blackboxBaudRate: 0,
          },
          {
            id: 1,
            functions: [SerialPortFunctions.GPS],
            mspBaudRate: 0,
            gpsBaudRate: 0,
            telemetryBaudRate: 0,
            blackboxBaudRate: 0,
          },
          {
            id: 2,
            functions: [SerialPortFunctions.TELEMETRY_IBUS],
            mspBaudRate: 0,
            gpsBaudRate: 0,
            telemetryBaudRate: 0,
            blackboxBaudRate: 0,
          },
        ],
      });
    });
  });
});
