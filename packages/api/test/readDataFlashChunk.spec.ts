import { MspDataView, WriteBuffer } from "@betaflight/msp";
import { readDataFlashChunk } from "../src";
import codes from "../src/codes";
import mockMsp from "./mockMsp";

describe("readDataFlashChunk", () => {
  it("should return the requested chunk of flash data for a v1.30.0 device", async () => {
    mockMsp.setApiVersion("1.30.0");
    mockMsp.setResponse([
      0, 160, 0, 0, 12, 0, 1, 0, 0, 0, 20, 10, 5, 2, 129, 64, 160, 80, 40,
    ]);
    const data = await readDataFlashChunk("/dev/serial", 10 * 4096, 10);

    expect(data).toEqual(
      Buffer.from([12, 0, 1, 0, 0, 0, 20, 10, 5, 2, 129, 64, 160, 80, 40])
    );
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/serial", {
      code: codes.MSP_DATAFLASH_READ,
      data: [0, 160, 0, 0],
      match: expect.any(Function),
      timeout: 1000,
    });
  });

  it("should handle decompressing flash data for a v1.40.0 device", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([
      0,
      0,
      0,
      0,
      17, // Data size
      0,
      1, // compressed
      13, // 13 compressed chars
      0,
      40, // data start
      20,
      10,
      5,
      2,
      129,
      64,
      160,
      80,
      40,
      20,
      10,
      5,
      2,
      129,
      64, // extra
      160,
    ]);
    const data = await readDataFlashChunk("/dev/serial", 10 * 4096, 11);

    expect(data).toEqual(
      Buffer.from([
        255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
      ])
    );
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/serial", {
      code: codes.MSP_DATAFLASH_READ,
      data: [0, 160, 0, 0, 11, 0, 1],
      match: expect.any(Function),
      timeout: 1000,
    });
  });

  it("should handle uncompressed flash data for a v1.40.0 device", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([
      0,
      0,
      0,
      0,
      11, // Data size
      0,
      0, // Not compressed
      40, // data start
      20,
      10,
      5,
      64,
      160,
      80,
      40,
      20,
      10,
      5,
      2,
      129,
      64, // extra
      160,
    ]);
    const data = await readDataFlashChunk("/dev/serial", 10 * 4096, 11);

    expect(data).toEqual(
      Buffer.from([40, 20, 10, 5, 64, 160, 80, 40, 20, 10, 5])
    );
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/serial", {
      code: codes.MSP_DATAFLASH_READ,
      data: [0, 160, 0, 0, 11, 0, 1],
      match: expect.any(Function),
      timeout: 1000,
    });
  });

  it("should use match function to match response address", async () => {
    mockMsp.setApiVersion("1.30.0");
    // we don't really care about the response here
    mockMsp.setResponse([0, 0, 0, 0]);
    await readDataFlashChunk("/dev/serial", 10, 10);

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/serial", {
      code: codes.MSP_DATAFLASH_READ,
      data: [10, 0, 0, 0],
      match: expect.any(Function),
      timeout: 1000,
    });
    const [, { match }] = mockMsp.execute.mock.calls[0]!;

    const toDataView = (writeBuffer: WriteBuffer) => {
      const arrayBuffer = new ArrayBuffer(writeBuffer.length);
      const array = new Uint8Array(arrayBuffer);
      writeBuffer.forEach((byte, i) => {
        array[i] = byte;
      });

      return new MspDataView(arrayBuffer);
    };
    // an address of 12 should not match
    expect(match!(toDataView(new WriteBuffer().push32(12)))).toBeFalsy();
    // But an address of 10 should
    expect(match!(toDataView(new WriteBuffer().push32(10)))).toBeTruthy();
  });
});
