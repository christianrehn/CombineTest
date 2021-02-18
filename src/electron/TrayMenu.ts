import {app, Menu, nativeImage, Tray} from 'electron';
import {appManager} from './AppManager';

export class TrayMenu {
    private iconPath: string = '/assets/golf-icon.png';

    public readonly tray: Tray;

    constructor() {
        this.tray = new Tray(this.createNativeImage());
        this.tray.setContextMenu(this.createMenu());
        this.tray.setToolTip('Approach Shot')
    }

    private createNativeImage() {
        const path: string = `${app.getAppPath()}${this.iconPath}`;
        console.log(path);
        const image: Electron.NativeImage = nativeImage.createFromPath(path);
        // Marks the image as a template image.
        image.setTemplateImage(true);
        return image;
    }

    private createMenu(): Menu {
        const contextMenu: Menu = Menu.buildFromTemplate([
            {
                label: 'Open',
                type: 'normal',
                click: (): void => {
                    /* open the Main Window */
                    appManager.getWindow('AlarmWindow').window.show();
                }
            },
            {
                label: 'Quit',
                type: 'normal',
                click: () => app.quit()
            }
        ]);
        return contextMenu;
    }
}