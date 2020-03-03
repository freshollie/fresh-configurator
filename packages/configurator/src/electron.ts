import { app, BrowserWindow } from "electron";

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
  win.loadFile("index.html");

  win.once("ready-to-show", () => {
    win.show();
  });
};

app.on("ready", createWindow);
