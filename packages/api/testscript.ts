/* eslint-disable no-constant-condition */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import {
  apiVersion,
  open,
  ports,
  readMotorConfig,
  writeMotorConfig,
} from "./src";

(async () => {
  console.log(await ports());
  const port = (await ports())[2]!;
  await open(port);
  console.log(apiVersion(port));
  console.log(await readMotorConfig(port));
  await writeMotorConfig(port, {
    minThrottle: 1070,
    maxThrottle: 2000,
    minCommand: 1001,
    motorCount: 0,
    motorPoles: 0,
    useDshotTelemetry: false,
    useEscSensor: false,
  });
})();
