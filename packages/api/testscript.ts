/* eslint-disable no-constant-condition */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { apiVersion, open, ports, readModeRangeSlots } from "./src";

(async () => {
  console.log(await ports());
  const port = (await ports())[1]!.path;
  await open(port);
  console.log(apiVersion(port));
  console.log(await readModeRangeSlots(port));
})();
