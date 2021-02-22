import mockMsp from "./mockMsp";
import { readSerialConfig } from "../src";
import codes from "../src/codes";

describe("readRCTuning", () => {
  it("should respond correctly for version 1.42.0", async () => {
    mockMsp.setApiVersion("1.42.0");
    mockMsp.setResponse([
      0,
      1,
      0,
      5,
      4,
      0,
      5,
      1,
      0,
      32,
      5,
      4,
      0,
      5,
      2,
      64,
      0,
      5,
      4,
      0,
      5,
    ]);

    const config = await readSerialConfig("/dev/someport");
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_CF_SERIAL_CONFIG,
    });
    expect(config.ports).toHaveLength(3);
    expect(config).toMatchInlineSnapshot(`
      Object {
        "ports": Array [
          Object {
            "blackboxBaudRate": 115200,
            "functions": Array [
              0,
            ],
            "gpsBaudRate": 57600,
            "id": 0,
            "mspBaudRate": 115200,
            "telemetryBaudRate": -1,
          },
          Object {
            "blackboxBaudRate": 115200,
            "functions": Array [
              13,
            ],
            "gpsBaudRate": 57600,
            "id": 1,
            "mspBaudRate": 115200,
            "telemetryBaudRate": -1,
          },
          Object {
            "blackboxBaudRate": 115200,
            "functions": Array [
              7,
            ],
            "gpsBaudRate": 57600,
            "id": 2,
            "mspBaudRate": 115200,
            "telemetryBaudRate": -1,
          },
        ],
      }
    `);
  });
});
