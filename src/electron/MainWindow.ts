import {app, BrowserWindow} from 'electron';

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

        // Load our index.html
        mainWindow.loadURL(`file://${app.getAppPath()}/index.html`)

        // Open the DevTools.
        mainWindow.webContents.openDevTools();

        return mainWindow;
    }
}