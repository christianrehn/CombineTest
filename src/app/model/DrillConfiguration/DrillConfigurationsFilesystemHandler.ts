import {ipcRenderer} from "electron";
import {drillConfigurationsToString} from "./DrillConfigurationConverter";
import {IDrillConfiguration} from "./DrillConfiguration";

type LoadUserDrillConfigurationsAsStringReturnType = { userDrillConfigurationsFilename: string, userDrillConfigurationsAsString: string }
export type LoadUserDrillConfigurationsAsJsonReturnType = { userDrillConfigurationsFilename: string, userDrillConfigurationsAsJson: any[] }

export const loadUserDrillConfigurationsAsJson = (): LoadUserDrillConfigurationsAsJsonReturnType => {
    const {
        userDrillConfigurationsFilename,
        userDrillConfigurationsAsString
    }: LoadUserDrillConfigurationsAsStringReturnType = ipcRenderer.sendSync('loadUserDrillConfigurationsAsString', undefined);
    if (!userDrillConfigurationsAsString) {
        console.log("loadUserDrillConfigurationsAsJson - no user configuration file found");
        return {
            userDrillConfigurationsFilename,
            userDrillConfigurationsAsJson: []
        };
    }
    const userDrillConfigurationsAsJson = JSON.parse(userDrillConfigurationsAsString)
    return {userDrillConfigurationsFilename, userDrillConfigurationsAsJson};
}

export const saveUserDrillConfigurations = (drillConfigurations: IDrillConfiguration[]): void => {
    console.log("saveUserDrillConfigurations - drillConfigurations=", drillConfigurations);
    const drillConfigurationsAsString: string = drillConfigurationsToString(drillConfigurations);
    const success = ipcRenderer.sendSync('saveUserDrillConfigurations', drillConfigurationsAsString);
    console.log("saveUserDrillConfigurations - success=", success);
}
