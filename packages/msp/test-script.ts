import { open, ports, readOSDConfig } from "./src";

(async () => {
  const portsList = await ports();

  const port = portsList[1];
  await open(port);

  console.log(JSON.stringify(await readOSDConfig(port), undefined, 4));
})();
