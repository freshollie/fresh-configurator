// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from "electron";
import path from "path";
import url from "url";
import getPort from "get-port";
import backend from "@betaflight/api-server";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | undefined;

const DEV_MODE =
  process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "development";

let backendPort = 9000;

const startBackend = async (): Promise<void> => {
  backendPort = await getPort({ port: backendPort });
  console.log(`Starting backend on ${backendPort}`);
  await backend.listen(backendPort);
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

  const backendAddress = `localhost:${backendPort}`;
  if (DEV_MODE) {
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
  mainWindow.webContents.once("dom-ready", async () => {
    mainWindow?.show();

    // Open the DevTools automatically if developing
    if (DEV_MODE) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
        APOLLO_DEVELOPER_TOOLS,
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
