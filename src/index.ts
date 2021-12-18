import {app, BrowserWindow, ipcMain} from 'electron';
import electronIsDev from "electron-is-dev";
import fs from "fs";
import path from "path";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

/**
 * Electron Main-Prozess.
 */

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

const createWindow = (): void => {
    console.log('appPath: ', app.getAppPath());
    if (electronIsDev) {
        console.log('Running in development');
    } else {
        console.log('Running in production');
    }

    // Create the browser window.
    const mainWindow: BrowserWindow = new BrowserWindow({
        fullscreenable: true,
        maximizable: true,
        // closable: false,
        height: 600,
        width: 800,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // create splash window
    var splashWindow: BrowserWindow = new BrowserWindow({
        height: 600,
        width: 1000,
        transparent: true,
        frame: false,
        alwaysOnTop: true
    });
    splashWindow.setResizable(false);
    splashWindow.loadFile('splash.html');
    splashWindow.center();
    splashWindow.on('closed', (): null => (splashWindow = null));


    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // if main window is ready to show, then destroy the splash window and show up the main window
    mainWindow.once('ready-to-show', (): void => {
        splashWindow.close();
        mainWindow.show();
    });

    // Open the DevTools.
    if (electronIsDev) {
        mainWindow.webContents.openDevTools();
    }

    ipcMain.on('appPath', (event: Electron.IpcMainEvent, arg: any): void => {
        event.returnValue = app.getAppPath();
    })

    ipcMain.on('quit', (event: Electron.IpcMainEvent, arg: any): void => {
        app.quit();
    })

    const userDrillConfigurationsFilename: string = path.join(app.getPath('userData'), "DrillConfigurations.json");

    ipcMain.on("loadUserDrillConfigurationsAsString", (event: Electron.IpcMainEvent, arg: any): void => {
        console.log("loadUserDrillConfigurationsAsString - userDrillConfigurationsFilename=", userDrillConfigurationsFilename);
        if (!fs.existsSync(userDrillConfigurationsFilename)) {
            console.log("loadUserDrillConfigurationsAsString - no user configuration file found");
            event.returnValue = '';
        } else {
            event.returnValue = fs.readFileSync(userDrillConfigurationsFilename, 'utf8');
        }
    });

    ipcMain.on("saveUserDrillConfigurations", (event: Electron.IpcMainEvent, drillConfigurationsAsString: any): void => {
        console.log("saveUserDrillConfigurations - userDrillConfigurationsFilename=", userDrillConfigurationsFilename);
        fs.writeFileSync(userDrillConfigurationsFilename, drillConfigurationsAsString, 'utf8');
        event.returnValue = true;
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', (): void => {
//     appManager.setTray(new TrayMenu());
//     appManager.setWindow('MainWindow', createWindow);
// });
app.on('ready', (): void => {
    return createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', (): void => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', (): void => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
