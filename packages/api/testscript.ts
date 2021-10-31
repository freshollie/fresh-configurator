/* eslint-disable no-constant-condition */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import {
  apiVersion,
  open,
  ports,
  readVtxTableBandsRow,
  writeVtxTableBandsRow,
} from "./src";

(async () => {
  const port = (await ports())[0]!.path;
  await open(port);
  console.log(apiVersion(port));
  await writeVtxTableBandsRow(port, {
    rowNumber: 1,
    isFactoryBand: true,
    letter: "A",
    name: "Band A",
    frequencies: [1, 2, 3],
  });
  console.log(await readVtxTableBandsRow(port, 1));
})();
