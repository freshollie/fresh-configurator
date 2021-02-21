import mockMsp from "./mockMsp";
import { GpsProtocols, GpsSbasTypes, writeGpsConfig } from "../src";
import codes from "../src/codes";

describe("writeGpsConfig", () => {
  it("should write the gps config to the device for v1.40.0", async () => {
    mockMsp.setApiVersion("1.40.0");
    await writeGpsConfig("/dev/someport", {
      provider: GpsProtocols.NMEA,
      ubloxSbas: GpsSbasTypes.AUTO,
      autoConfig: false,
      autoBaud: false,
      homePointOnce: false,
      ubloxUseGalileo: false,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_SET_GPS_CONFIG,
      data: [0, 0, 0, 0],
    });
  });
});
