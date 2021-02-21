import mockMsp from "./mockMsp";
import { GpsProtocols, GpsSbasTypes, readGpsConfig } from "../src";
import codes from "../src/codes";

describe("readGpsConfig", () => {
  it("should read the gps config from the device for v1.40.0", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([1, 3, 1, 0]);

    expect(await readGpsConfig("/dev/someport")).toEqual({
      provider: GpsProtocols.UBLOX,
      ubloxSbas: GpsSbasTypes.MSAS,
      autoConfig: true,
      autoBaud: false,
      homePointOnce: false,
      ubloxUseGalileo: false,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_GPS_CONFIG,
    });
  });
  it("should read a default gps config from the device when gps is not enabled", async () => {
    mockMsp.setApiVersion("1.40.0");
    mockMsp.setResponse([]);

    expect(await readGpsConfig("/dev/someport")).toEqual({
      provider: GpsProtocols.NMEA,
      ubloxSbas: GpsSbasTypes.AUTO,
      autoConfig: false,
      autoBaud: false,
      homePointOnce: false,
      ubloxUseGalileo: false,
    });

    expect(mockMsp.execute).toHaveBeenCalledWith("/dev/someport", {
      code: codes.MSP_GPS_CONFIG,
    });
  });
});
