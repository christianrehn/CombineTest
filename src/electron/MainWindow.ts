import { app, BrowserWindow } from 'electron';

export class MainWindow {
  public readonly window: BrowserWindow;

  constructor() {
    this.window = this.createWindow();
  }

  createWindow(): BrowserWindow {
    const browserWindow: BrowserWindow = new BrowserWindow({
      fullscreenable: true,
      maximizable: true,
      // closable: false,
      width: 1280,
      height: 1024,
      show: true,
      webPreferences: {
        nodeIntegration: true
      }
    })
    browserWindow.maximize();

    // Load our index.html
    browserWindow.loadURL(`file://${app.getAppPath()}/index.html`)

    return browserWindow;
  }
}