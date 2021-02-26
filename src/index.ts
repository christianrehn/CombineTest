import {app, BrowserWindow} from 'electron';
import electronIsDev from "electron-is-dev";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

// // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
//     app.quit();
// }

const createWindow = (): void => {
    if (electronIsDev) {
        console.log('Running in development');
    } else {
        console.log('Running in production');
    }

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        fullscreenable: true,
        maximizable: true,
        // closable: false,
        height: 600,
        width: 800,
        show: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    if (electronIsDev) {
        mainWindow.webContents.openDevTools();
    }
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

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
