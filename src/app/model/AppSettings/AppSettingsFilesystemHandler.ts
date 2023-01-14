import {ipcRenderer} from "electron";
import {IAppSettings} from "./AppSettings";
import {appSettingsToString} from "./AppSettingsConverter";

type LoadAppSettingsAsStringReturnType = { appSettingsFilename: string, appSettingsAsString: string }
export type LoadAppSettingsAsJsonReturnType = { appSettingsFilename: string, appSettingsAsJson: any }

export const loadAppSettingsAsJson = (): LoadAppSettingsAsJsonReturnType => {
    const {
        appSettingsFilename,
        appSettingsAsString,
    }: LoadAppSettingsAsStringReturnType = ipcRenderer.sendSync('loadAppSettingsAsString', undefined);
    if (!appSettingsAsString) {
        console.log("loadAppSettingsAsJson - no settings file found");
        return {
            appSettingsFilename,
            appSettingsAsJson: {},
        };
    }
    const appSettingsAsJson = JSON.parse(appSettingsAsString);
    console.log("loadAppSettingsAsJson - appSettingsAsJson=", appSettingsAsJson)
    return {appSettingsFilename, appSettingsAsJson};
}

export const saveAppSettings = (appSettings: IAppSettings): void => {
    console.log("saveAppSettings - appSettings=", appSettings);

    const appSettingsAsString: string = appSettingsToString(appSettings);
    const success = ipcRenderer.sendSync('saveAppSettings', appSettingsAsString);
    console.log("saveAppSettings - success=", success);
}
