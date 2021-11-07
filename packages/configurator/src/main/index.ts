import "source-map-support/register";
// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import url from "url";
import fs from "fs";

import unhandled from "electron-unhandled";
import type { ApolloLink } from "@apollo/client";
import { createIpcExecutor } from "./IpcLinkServer";
import { createSchemaLink } from "../shared/SchemaLink";

unhandled({
  showDialog: true,
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | undefined;

const E2E = process.env.E2E === "true";
const PRODUCTION = process.env.NODE_ENV === "production";

const artifactsDirectory = PRODUCTION
  ? path.join(app.getPath("temp"), `artifacts-${new Date().getTime()}`)
  : path.join(__dirname, "artifacts");

const createBackend = async (
  mocked: boolean
): Promise<{ link: ApolloLink; start: () => Promise<void> | void }> => {
  if (PRODUCTION) {
    const { schema, mockedDeviceContext, context, startMockDevice } =
      await import("@betaflight/api-graph");
    return {
      link: createSchemaLink({
        schema,
        context: (mocked ? mockedDeviceContext : context)({
          artifactsDir: artifactsDirectory,
        }),
      }),
      start: () => {
        if (mocked) {
          startMockDevice();
        }
      },
    };
  }
  const { createServer } = await import("@betaflight/api-server");
  const backend = createServer({
    mocked,
    artifactsDirectory,
  });
  return {
    link: createSchemaLink({
      schema: backend.schema,
      context: backend.context,
    }),
    start: async () => {
      const port = await backend.listen({
        hostname: "127.0.0.1",
      });
      console.log(`Starting backend on ${port}`);
    },
  };
};

const startBackend = async (): Promise<void> => {
  if (PRODUCTION) {
    await fs.promises.mkdir(artifactsDirectory);
  }

  const mocked = process.env.MOCKED === "true" || E2E;
  if (mocked) {
    console.log("Creating backend in mocked mode");
  }

  const { link, start } = await createBackend(mocked);
  createIpcExecutor({ link, ipc: ipcMain });

  await start();
};

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      // Allow acccess to temp directory
      webSecurity: false,
      allowRunningInsecureContent: false,
      // Need these enabled when e2e is running
      nodeIntegration: E2E,
      enableRemoteModule: E2E,
      contextIsolation: false,
      preload: `${__dirname}/preload.js`,
    },
  });

  const searchQuery = `artifacts=file://${artifactsDirectory}`;
  if (!PRODUCTION) {
    console.log("loading renderer in development");
    mainWindow.loadURL(
      url.format({
        protocol: "http:",
        host: "localhost:8080",
        pathname: "index.html",
        search: searchQuery,
        slashes: true,
      })
    );
  } else {
    console.log("loading renderer");
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"), {
      search: searchQuery,
    });
  }

  // Don't show until we react has fully loaded
  ipcMain.once("paint", async () => {
    if (process.env.HEADLESS !== "true") {
      mainWindow?.show();
    }

    // Open the DevTools automatically if developing
    if (!PRODUCTION && !E2E) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
        APOLLO_DEVELOPER_TOOLS,
        // eslint-disable-next-line import/no-extraneous-dependencies
      } = await import("electron-devtools-installer");
      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        // eslint-disable-next-line no-console
        console.log("Error loading React DevTools: ", err)
      );
      installExtension(APOLLO_DEVELOPER_TOOLS).catch((err) =>
        // eslint-disable-next-line no-console
        console.log("Error loading Apollo DevTools: ", err)
      );
      mainWindow?.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = undefined;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  await startBackend();
  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === undefined) {
    createWindow();
  }
});
