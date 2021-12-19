import {hot} from 'react-hot-loader';
import * as React from 'react';
import './App.scss';
import {
    EditDrillConfigurationPage,
    EditDrillConfigurationPageName
} from "./views/EditDrillConfigurationPage/EditDrillConfigurationPage";
import {DrillPage, DrillPageName} from "./views/DrillPage/DrillPage";
import {EmptyDrillConfiguration, IDrillConfiguration} from "./model/DrillConfiguration/DrillConfiguration";
import {parseCsvToArrayOfColumnArrays} from "./util/CsvParser";
import * as path from "path";
import {ipcRenderer} from "electron";
import predefinedDrillConfigurationsAsJson from "../data/PredefinedDrillConfigurations.json";
import averageShotsFromTeeCsvPath from "../data/tee.csv";
import averageShotsFromFairwayCsvPath from "../data/fairway.csv";
import averageShotsFromRoughCsvPath from "../data/rough.csv";
import averageShotsFromGreenCsvPath from "../data/green.csv";
import {AverageStrokesData, IAverageStrokesData} from "./model/AverageStrokesData/AverageStrokesData";
import {SelectDrillPage, SelectDrillPageName} from "./views/SelectDrillPage/SelectDrillPage";
import {
    drillConfigurationsFromJson,
    drillConfigurationsToString
} from "./model/DrillConfiguration/DrillConfigurationConverter";
import {assert} from "chai";
import {GroundTypeEnum} from "./model/AverageStrokesData/GroundTypeEnum";

const App: React.FC<{}> = (): JSX.Element => {
    // page that is currently visible
    const [selectedPage, setSelectedPage] = React.useState<string>(SelectDrillPageName);

    const lastShotCsvPath: string = process.platform !== 'darwin'
        ? "C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV"
        : "/Users/rehn/IdeaProjects/GCQuadCombineTest/test/data/LastShot.CSV";

    const [drillConfigurations, setDrillConfigurations] = React.useState<IDrillConfiguration[]>([]);
    const [selectedDrillConfiguration, setSelectedDrillConfiguration] = React.useState<IDrillConfiguration>();

    const [averageStrokesDataMap, setAverageStrokesDataMap] =
        React.useState<Map<GroundTypeEnum, IAverageStrokesData>>(new Map<GroundTypeEnum, IAverageStrokesData>());

    React.useEffect((): void => {
        const importCsv = async (averageShotsGroundTypeEnum: GroundTypeEnum, filePath: string, unit: string): Promise<void> => {
            const distancesAndStrokes: [number[], number[]] = await parseCsvToArrayOfColumnArrays(filePath);
            const averageStrokesData: IAverageStrokesData = new AverageStrokesData(averageShotsGroundTypeEnum, distancesAndStrokes[0], unit, distancesAndStrokes[1]);
            averageStrokesDataMap.set(averageShotsGroundTypeEnum, averageStrokesData);
            setAverageStrokesDataMap(new Map(averageStrokesDataMap));
        }

        const appPath: string = ipcRenderer.sendSync('appPath', undefined);
        importCsv(GroundTypeEnum.Tee, path.join(appPath, '.webpack/renderer', averageShotsFromTeeCsvPath), "yard");
        importCsv(GroundTypeEnum.Fairway, path.join(appPath, '.webpack/renderer', averageShotsFromFairwayCsvPath), "yard");
        importCsv(GroundTypeEnum.Rough, path.join(appPath, '.webpack/renderer', averageShotsFromRoughCsvPath), "yard");
        importCsv(GroundTypeEnum.Green, path.join(appPath, '.webpack/renderer', averageShotsFromGreenCsvPath), "feet");
    }, [])

    React.useEffect((): void => {
        const userDrillConfigurationsAsJson: any[] = loadUserDrillConfigurationsAsJson();
        const drillConfigurationsAsJson: any[] = !!userDrillConfigurationsAsJson && userDrillConfigurationsAsJson.length > 0
            ? userDrillConfigurationsAsJson
            : predefinedDrillConfigurationsAsJson;
        const drillConfigurations: IDrillConfiguration[] = drillConfigurationsFromJson(drillConfigurationsAsJson, averageStrokesDataMap);
        setDrillConfigurations(drillConfigurations);
    }, [predefinedDrillConfigurationsAsJson, averageStrokesDataMap]);

    const handleDrillConfigurationsChanged = (drillConfigurations: IDrillConfiguration[]): void => {
        setDrillConfigurations(drillConfigurations);
    }

    const handleSelectedDrillConfigurationChanged = (drillConfiguration: IDrillConfiguration): void => {
        !!drillConfiguration
            ? setSelectedDrillConfiguration(drillConfiguration)
            : setSelectedDrillConfiguration(new EmptyDrillConfiguration(averageStrokesDataMap));
    }

    const loadUserDrillConfigurationsAsJson = (): any[] => {
        const userDrillConfigurationsAsString: string = ipcRenderer.sendSync('loadUserDrillConfigurationsAsString', undefined);
        if (!userDrillConfigurationsAsString) {
            console.log("loadUserDrillConfigurationsAsJson - no user configuration file found");
            return [];
        }
        return JSON.parse(userDrillConfigurationsAsString);
    }

    const handleSaveUserDrillConfigurations = (changedDrillConfiguration: IDrillConfiguration): void => {
        const drillConfigurationsClone: IDrillConfiguration[] = [...drillConfigurations];
        const drillConfigurationUuids: string[] = drillConfigurationsClone.map((drillConfiguration: IDrillConfiguration) => drillConfiguration.getUuid());

        if (!changedDrillConfiguration) {
            // selectedDrillConfiguration has been deleted
            const deletedDrillConfigurationIndex: number = drillConfigurationUuids.indexOf(selectedDrillConfiguration.getUuid())
            assert(deletedDrillConfigurationIndex >= 0, "deletedDrillConfigurationIndex < 0");
            drillConfigurationsClone.splice(deletedDrillConfigurationIndex, 1);
            setSelectedDrillConfiguration(undefined);


        } else {
            // selectedDrillConfiguration has been updated or is new
            assert(!!changedDrillConfiguration.getUuid(), "!changedDrillConfiguration.getUuid()");
            console.log("handleSaveUserDrillConfigurations - changedDrillConfiguration", changedDrillConfiguration)

            const index: number = drillConfigurationUuids.indexOf(changedDrillConfiguration.getUuid())
            if (index >= 0) {
                drillConfigurationsClone[index] = changedDrillConfiguration; // replace with changed entry
            } else {
                drillConfigurationsClone.push(changedDrillConfiguration); // new entry
            }
            setSelectedDrillConfiguration(changedDrillConfiguration);
        }

        setDrillConfigurations(drillConfigurationsClone);
        const drillConfigurationsAsString: string = drillConfigurationsToString(drillConfigurationsClone);
        console.log("drillConfigurationsAsString", drillConfigurationsAsString)
        const success = ipcRenderer.sendSync('saveUserDrillConfigurations', drillConfigurationsAsString);
        console.log("handleSaveUserDrillConfigurations - success=", success)
    }

    return (
        <div className="app">
            {selectedPage === SelectDrillPageName
                ? <SelectDrillPage
                    drillConfigurations={drillConfigurations}
                    handleDrillConfigurationsChanged={handleDrillConfigurationsChanged}
                    selectedDrillConfiguration={selectedDrillConfiguration}
                    handleSelectedDrillConfigurationChanged={handleSelectedDrillConfigurationChanged}
                    handleSelectPageClicked={setSelectedPage}
                />
                : selectedPage === EditDrillConfigurationPageName
                    ? <EditDrillConfigurationPage
                        drillConfigurations={drillConfigurations}
                        selectedDrillConfiguration={selectedDrillConfiguration}
                        handleSelectPageClicked={setSelectedPage}
                        handleSaveDrillConfigurations={handleSaveUserDrillConfigurations}
                        averageStrokesDataMap={averageStrokesDataMap}
                    />
                    : selectedPage === DrillPageName
                        ? <DrillPage
                            lastShotCsvPath={lastShotCsvPath}
                            selectedDrillConfiguration={selectedDrillConfiguration}
                            handleSelectPageClicked={setSelectedPage}
                        />
                        : null
            }
        </div>
    );
}

export default hot(module)(App);
