import { ports } from "@betaflight/msp";

(async () => {
  console.log(await ports());
})();
