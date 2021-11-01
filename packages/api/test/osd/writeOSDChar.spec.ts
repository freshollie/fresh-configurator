import { writeOSDChar } from "../../src";
import codes from "../../src/codes";
import mockMsp from "../mockMsp";

describe("writeOSDChar", () => {
  it("should write the osd chracter buffer to the given address", async () => {
    await writeOSDChar("/dev/someport", 45, Buffer.from([1, 2, 3, 4]));
    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_OSD_CHAR_WRITE,
      data: [45, 1, 2, 3, 4],
    });
  });
});
