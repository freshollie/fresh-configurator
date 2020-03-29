// electron-builder requires that electron is in the dev dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from "electron";
import { join } from "path";

const createWindow = (): void => {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    show: false
  });

  // and load the index.html of the app.
  win.loadFile(join(__dirname, "index.html"));

  win.once("ready-to-show", () => {
    win.show();
  });
};

app.on("ready", createWindow);
