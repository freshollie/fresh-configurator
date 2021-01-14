import { Application } from "spectron";

import path from "path";
import os from "os";
import fs from "fs";

const PRODUCTION = process.env.PRODUCTION === "true";

const exists = (filePath: string): Promise<boolean> =>
  fs.promises
    .access(filePath)
    .then(() => true)
    .catch(() => false);

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
  const main = path.join(__dirname, "../../build/main.js");
  if (!PRODUCTION && !(await exists(main))) {
    throw new Error("E2E tests expect configurator to be running");
  } else if (PRODUCTION && !(await exists(binaryPath()))) {
    throw new Error("Production e2e tests expect configurator to be built");
  }
  if (!app) {
    app = new Application({
      env: {
        E2E: "true",
        HEADLESS: "true",
      },
      path: PRODUCTION ? binaryPath() : ((electronPath as unknown) as string),
      args: PRODUCTION
        ? undefined
        : [path.join(__dirname, "../../build/main.js")],
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
