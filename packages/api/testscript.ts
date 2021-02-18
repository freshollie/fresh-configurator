import {
  apiVersion,
  open,
  ports,
  readRxConfig,
  SerialRxProviders,
  writeRxConfig,
} from "./src";

(async () => {
  console.log(await ports());
  const port = (await ports())[2]!;
  console.log(apiVersion(port));
  await open(port);
  console.log(await readRxConfig(port));
  await writeRxConfig(port, { serialRxProvider: SerialRxProviders.IBUS });
  console.log(await readRxConfig(port));
})();
