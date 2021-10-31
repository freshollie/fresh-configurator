/* eslint-disable no-constant-condition */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { apiVersion, open, ports, writeOSDChar } from "./src";

(async () => {
  console.log(await ports());
  const port = (await ports())[0]!.path;
  await open(port);
  console.log(apiVersion(port));
  await writeOSDChar(port, 0, Buffer.from([1]));
})();
