import { open, ports, readMixerConfig } from "./src";

(async () => {
  const port = (await ports())[1]!;
  await open(port);
  console.log(await readMixerConfig(port));
})();
