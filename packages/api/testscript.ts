/* eslint-disable no-constant-condition */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import {
  apiVersion,
  open,
  ports,
  readGpsConfig,
  close,
  writeGpsConfig,
  GpsProtocols,
  GpsSbasTypes,
} from "./src";

(async () => {
  console.log(await ports());
  const port = (await ports())[2]!;
  await open(port);
  console.log(apiVersion(port));
  await writeGpsConfig(port, {
    provider: GpsProtocols.NMEA,
    ubloxSbas: GpsSbasTypes.AUTO,
    autoConfig: false,
    autoBaud: false,
    homePointOnce: false,
    ubloxUseGalileo: false,
  });
  const map = await readGpsConfig(port);
  console.log("gps", map);
  await close(port);
})();
