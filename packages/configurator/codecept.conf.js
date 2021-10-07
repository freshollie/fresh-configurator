const path = require("path");
const os = require("os");
const fs = require("fs");
// eslint-disable-next-line import/no-extraneous-dependencies
require("ts-node/register");

// eslint-disable-next-line import/no-extraneous-dependencies
const electronPath = require("electron");

const PRODUCTION = process.env.PRODUCTION === "true";
const HEADLESS = process.env.HEADLESS === "true";

const exists = (filePath) => {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (_) {
    return false;
  }
};

const binaryPath = () => {
  switch (os.platform()) {
    case "linux":
      return path.join(
        __dirname,
        "dist/linux-unpacked/betaflight-configurator"
      );
    case "darwin":
      return path.join(
        __dirname,
        "dist/mac/Betaflight Configurator.app/Contents/MacOS/Betaflight Configurator"
      );
    case "win32":
      return path.join(
        __dirname,
        "dist/win-unpacked/Betaflight Configurator.exe"
      );
    default:
      throw new Error("Unknown OS");
  }
};

const main = path.join(__dirname, "build/main.js");
if (!PRODUCTION && !exists(main)) {
  throw new Error("E2E tests expect configurator to be running");
} else if (PRODUCTION && !exists(binaryPath())) {
  throw new Error("Production e2e tests expect configurator to be built");
}

exports.config = {
  output: "./e2e/output",
  helpers: {
    Playwright: {
      video: true,
      trace: true,
      browser: "electron",
      electron: {
        executablePath: PRODUCTION ? binaryPath() : electronPath,
        args: PRODUCTION ? undefined : [path.join(__dirname, "build/main.js")],
        env: {
          E2E: "true",
          HEADLESS: HEADLESS ? "true" : "false",
          DISPLAY: ":0",
        },
      },
      waitForTimeout: 10000,
    },
  },
  tests: "e2e/**/*_test.ts",
  timeout: 10000,
  name: "Configurator e2e",
};
