import { createServer } from "./src";

(async () => {
  await createServer({ legacyWsProtocol: true }).listen({
    port: 9000,
    hostname: "127.0.0.1",
  });
  // eslint-disable-next-line no-console
  console.log("listening");
})();
