/* eslint-disable no-constant-condition */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import {
  apiVersion,
  commit,
  Features,
  open,
  close,
  ports,
  readEnabledFeatures,
  reboot,
  writeEnabledFeatures,
} from "./src";

(async () => {
  console.log(await ports());
  const port = (await ports())[2]!;
  await open(port);
  console.log(apiVersion(port));
  const features = await readEnabledFeatures(port);
  console.log("current features", features);
  const newFeatures = [
    Features.RX_SPI,
    Features.SOFTSERIAL,
    Features.DYNAMIC_FILTER,
  ];
  console.log("expected features", newFeatures);
  await writeEnabledFeatures(port, newFeatures);
  console.log("after write", await readEnabledFeatures(port));
  await commit(port);
  await reboot(port);
  while (true) {
    try {
      console.log("after reboot", await readEnabledFeatures(port));
      break;
    } catch (e) {}
  }
  await close(port);
})();
