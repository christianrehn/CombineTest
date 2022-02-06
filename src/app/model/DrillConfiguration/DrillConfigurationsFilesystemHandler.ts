import {ipcRenderer} from "electron";
import {drillConfigurationsToString} from "./DrillConfigurationConverter";
import {IDrillConfiguration} from "./DrillConfiguration";

export const loadUserDrillConfigurationsAsJson = (): any[] => {
    const userDrillConfigurationsAsString: string = ipcRenderer.sendSync('loadUserDrillConfigurationsAsString', undefined);
    if (!userDrillConfigurationsAsString) {
        console.log("loadUserDrillConfigurationsAsJson - no user configuration file found");
        return [];
    }
    return JSON.parse(userDrillConfigurationsAsString);
}

export const saveUserDrillConfigurations = (drillConfigurations: IDrillConfiguration[]): void => {
    console.log("saveUserDrillConfigurations - drillConfigurations=", drillConfigurations);
    const drillConfigurationsAsString: string = drillConfigurationsToString(drillConfigurations);
    const success = ipcRenderer.sendSync('saveUserDrillConfigurations', drillConfigurationsAsString);
    console.log("saveUserDrillConfigurations - success=", success);
}
