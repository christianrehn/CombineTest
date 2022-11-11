import {ipcRenderer} from "electron";
import {IAppSettings} from "./AppSettings";
import {appSettingsToString} from "./AppSettingsConverter";

export const loadAppSettingsAsJson = (): any => {
    const appSettingsAsString: string = ipcRenderer.sendSync('loadAppSettingsAsString', undefined);
    if (!appSettingsAsString) {
        console.log("loadAppSettingsAsJson - no settings file found");
        return {};
    }
    const appSettingsAsJson = JSON.parse(appSettingsAsString);
    console.log("loadAppSettingsAsJson - appSettingsAsJson=", appSettingsAsJson)
    return appSettingsAsJson;
}

export const saveAppSettings = (appSettings: IAppSettings): void => {
    console.log("saveAppSettings - appSettings=", appSettings);

    const appSettingsAsString: string = appSettingsToString(appSettings);
    const success = ipcRenderer.sendSync('saveAppSettings', appSettingsAsString);
    console.log("saveAppSettings - success=", success);
}
