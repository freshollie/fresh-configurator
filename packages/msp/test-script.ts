import { open, ports } from "./src";
import { executeCli } from "./src/connection";

(async () => {
  const list = await ports();
  const port = list.pop();
  console.log(port);
  await open(port);
  const start = new Date();
  console.log(await executeCli(port, "get"));
  console.log(new Date().getTime() - start.getTime());
})();
