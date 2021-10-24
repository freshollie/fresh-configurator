/* eslint-disable no-constant-condition */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import {
  apiVersion,
  open,
  ports,
  readVtxConfig,
  readVtxDeviceStatus,
  readVtxTableBandsRow,
} from "./src";

(async () => {
  const port = (await ports())[0]!.path;
  await open(port);
  console.log(apiVersion(port));
  console.log(await readVtxConfig(port));
  console.log(await readVtxDeviceStatus(port));
  console.log(await readVtxTableBandsRow(port, 1));
})();
