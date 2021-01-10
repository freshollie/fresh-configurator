import { Application } from "spectron";

import path from "path";
import os from "os";

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const electronPath = require("electron");

let app: Application | undefined;

const binaryPath = (): string => {
  switch (os.platform()) {
    case "linux":
      return path.join(
        __dirname,
        "../../dist/linux-unpacked/betaflight-configurator"
      );
    case "darwin":
      return path.join(
        __dirname,
        "../../dist/mac/Betaflight Configurator.app/Contents/MacOS/Betaflight Configurator"
      );
    case "win32":
      return path.join(
        __dirname,
        "../../dist/win-unpacked/Betaflight Configurator.exe"
      );
    default:
      throw new Error("Unknown OS");
  }
};

export default async (): Promise<Application> => {
  if (!app) {
    app = new Application({
      env: {
        E2E: "true",
        HEADLESS: "true",
      },
      path:
        process.env.CI === "true"
          ? binaryPath()
          : ((electronPath as unknown) as string),
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
