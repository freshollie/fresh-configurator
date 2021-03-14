/* eslint-disable no-constant-condition */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { apiVersion, open, ports, readName, writeName } from "./src";

(async () => {
  console.log(await ports());
  const port = (await ports())[2]!;
  await open(port);
  console.log(apiVersion(port));

  await writeName(port, "freshpv");
  // const chunk = await readDataFlashChunk(port, 10 * 4096, 512);
  // console.log(chunk);

  console.log(await readName(port));
})();
