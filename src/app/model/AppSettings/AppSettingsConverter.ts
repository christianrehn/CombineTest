import {assert} from "chai";
import {AppSettings, IAppSettings} from "./AppSettings";
import {v4 as uuidv4} from "uuid";

export const appSettingsToString = (appSettings: IAppSettings,): string => {
    assert(appSettings !== undefined, "appSettings === undefined");
    assert(appSettings !== null, "appSettings === null");

    const appSettingsAsJson: any = appSettings.toJson();
    return JSON.stringify(appSettingsAsJson);
}

export const appSettingsFromJson = (appSettingsAsJson: any,): IAppSettings => {
    assert(appSettingsAsJson !== undefined, "appSettingsAsJson === undefined");
    assert(appSettingsAsJson !== null, "appSettingsAsJson === null");

    return new AppSettings(appSettingsAsJson.uuid ?? uuidv4(), appSettingsAsJson.shotsUpdateType);
}
