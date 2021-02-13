import mockMsp from "./mockMsp";
import { writeSerialFunctions } from "../src";
import codes from "../src/codes";

describe("writeSerialFunctions", () => {
  it("should write the serial functions for each port", async () => {
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
    await writeSerialFunctions("/dev/someport", [
      {
        functions: [0],
        id: 0,
      },
      {
        functions: [13],
        id: 1,
      },
      {
        functions: [7],
        id: 2,
      },
    ]);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_CF_SERIAL_CONFIG,
      data: [0, 1, 0, 5, 4, 0, 5, 1, 0, 32, 5, 4, 0, 5, 2, 64, 0, 5, 4, 0, 5],
    });
  });

  it("should use the initial serial port values when port not given", async () => {
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
    await writeSerialFunctions("/dev/someport", [
      {
        functions: [0],
        id: 0,
      },
      {
        functions: [13],
        id: 1,
      },
    ]);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_CF_SERIAL_CONFIG,
      data: [0, 1, 0, 5, 4, 0, 5, 1, 0, 32, 5, 4, 0, 5, 2, 64, 0, 5, 4, 0, 5],
    });
  });
});
