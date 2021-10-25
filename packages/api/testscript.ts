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
  VtxDeviceTypes,
  writeVtxConfig,
} from "./src";

(async () => {
  const port = (await ports())[0]!.path;
  await open(port);
  console.log(apiVersion(port));
  console.log(await readVtxConfig(port));
  await writeVtxConfig(port, {
    type: VtxDeviceTypes.VTXDEV_SMARTAUDIO,
    band: 5,
    channel: 0,
    power: 0,
    pitMode: true,
    frequency: 0,
    deviceReady: false,
    lowPowerDisarm: 0,
    pitModeFrequency: 0,
    table: {
      available: true,
      numBands: 5,
      numBandChannels: 8,
      numPowerLevels: 5,
    },
  });
  console.log(await readVtxConfig(port));
})();
