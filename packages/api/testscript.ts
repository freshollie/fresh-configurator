/* eslint-disable no-constant-condition */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import {
  apiVersion,
  open,
  OSDAlarms,
  ports,
  readOSDConfig,
  writeOSDAlarm,
} from "./src";

(async () => {
  console.log(await ports());
  const port = (await ports())[2]!.path;
  await open(port);
  console.log(apiVersion(port));
  const config = await readOSDConfig(port);
  const before = config.alarms;
  console.log(before);
  await writeOSDAlarm(port, {
    key: OSDAlarms.RSSI,
    value: 69,
  });
  const afterConfig = await readOSDConfig(port);
  const after = afterConfig.alarms;
  console.log(after);
})();
