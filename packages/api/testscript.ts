import { open, ports, readBeeperConfig } from "./src";

(async () => {
  console.log(await ports());
  const port = (await ports())[2]!;
  await open(port);
  console.log(await readBeeperConfig(port));
})();
