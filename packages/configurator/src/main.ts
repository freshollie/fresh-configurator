// eslint-disable-next-line import/no-extraneous-dependencies
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  APOLLO_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from "electron";
import path from "path";
import url from "url";
import { createServer } from "@betaflight/api-server";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | undefined;

const E2E = process.env.E2E === "true";
const PRODUCTION = process.env.NODE_ENV === "production";

let backendPort: number | string = 9000;

const startBackend = async (): Promise<void> => {
  const mocked = process.env.MOCKED === "true" || E2E;
  if (mocked) {
    console.log("Creating backend in mocked mode");
  }
  const backend = createServer({ mocked });

  const { port } = await backend.listen();
  console.log(`Starting backend on ${port}`);

  backendPort = port;
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
      nodeIntegration: true,
    },
  });

  const backendAddress = `ws://localhost:${backendPort}`;
  if (!PRODUCTION) {
    mainWindow.loadURL(
      url.format({
        protocol: "http:",
        host: "localhost:8080",
        pathname: "index.html",
        search: `backend=${backendAddress}`,
        slashes: true,
      })
    );
  } else {
    mainWindow.loadFile(path.join(__dirname, "index.html"), {
      search: `backend=${backendAddress}`,
    });
  }

  // Don't show until we are ready and loaded
  mainWindow.webContents.once("dom-ready", () => {
    if (process.env.HEADLESS !== "true") {
      mainWindow?.show();
    }

    // Open the DevTools automatically if developing
    if (!PRODUCTION && !E2E) {
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
