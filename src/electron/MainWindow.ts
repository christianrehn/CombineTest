import {app, BrowserWindow} from 'electron';
import electronIsDev from "electron-is-dev";

/**
 * Creates the electron browser window.
 */
export class MainWindow {
    public readonly window: BrowserWindow;

    constructor() {
        this.window = this.createWindow();
    }

    createWindow(): BrowserWindow {
        let mainWindow: BrowserWindow = new BrowserWindow({
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
        mainWindow.maximize();

        // load index.html
        mainWindow.loadURL(`file://${app.getAppPath()}/index.html`)

        // open DevTools
        if (electronIsDev) {
            mainWindow.webContents.openDevTools();
        }

        return mainWindow;
    }
}
