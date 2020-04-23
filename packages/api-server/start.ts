import { createServer } from "./src";

createServer().listen(9000, () => {
  // eslint-disable-next-line no-console
  console.log("listening");
});
