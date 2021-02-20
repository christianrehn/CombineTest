import {app} from 'electron';
import {appManager} from '@/electron/AppManager';
import {TrayMenu} from '@/electron/TrayMenu';
import {MainWindow} from '@/electron/MainWindow';

/**
 * Electron entry point, see webpack.config.js
 */
app.on('ready', (): void => {
    appManager.setTray(new TrayMenu());
    appManager.setWindow('MainWindow', new MainWindow());
});