import { Application } from "spectron";

import path from "path";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const electronPath = require("electron");

let app: Application | undefined;

export default async (): Promise<Application> => {
  if (!app) {
    app = new Application({
      env: {
        E2E: "true",
        HEADLESS: "true",
      },
      path:
        process.env.CI === "true"
          ? path.join(
              __dirname,
              "../../dist/mac/Betaflight Configurator.app/Contents/MacOS/Betaflight Configurator"
            )
          : electronPath,
      args:
        process.env.CI === "true"
          ? undefined
          : [path.join(__dirname, "../../dev.js")],
    });
  }

  if (!app.isRunning()) {
    await app.start();
  } else {
    app.browserWindow.reload();
  }

  await app.client.waitUntilWindowLoaded();
  return app;
};

afterAll(() => app?.isRunning() && app.stop());
