import { app, BrowserWindow } from 'electron';
import { appManager } from '@/electron/AppManager';
import { TrayMenu } from '@/electron/TrayMenu';
import { MainWindow } from '@/electron/MainWindow';


app.on('ready', (): void => {
  appManager.setTray(new TrayMenu());
  appManager.setWindow('AlarmWindow', new MainWindow());
});