import { apiVersion, open, ports } from "./src";

(async () => {
  const port = (await ports())[1]!;
  await open(port);
  console.log(apiVersion(port));
})();
