import { app, BrowserWindow } from 'electron';
import { appManager } from '@/electron/AppManager';
import { TrayMenu } from '@/electron/TrayMenu';
import { AlarmWindow } from '@/electron/AlarmWindow';


app.on('ready', () => {
  appManager.setTray(new TrayMenu());
  appManager.setWindow('AlarmWindow', new AlarmWindow());
});