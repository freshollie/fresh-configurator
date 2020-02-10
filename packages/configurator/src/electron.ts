import { app, BrowserWindow } from "electron";

const createWindow = (): void => {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile("index.html");
};

app.on("ready", createWindow);
