import {hot} from 'react-hot-loader';
import * as React from 'react';
import './App.scss';
import {SettingsPage, SettingsPageName} from "./views/SettingsPage/SettingsPage";
import {DrillPage, DrillPageName} from "./views/DrillPage/DrillPage";
import {
    DrillConfigurationWithFixedDistancesGenerator,
    IDrillConfiguration,
    DrillConfigurationWithRandomDistancesGenerator,
    DrillConfigurationWithRandomFromFixedDistancesGenerator
} from "./model/DrillConfiguration";
import {parseCsvToArrayOfColumnArrays} from "./util/CsvParser";
import * as path from "path";
import {ipcRenderer} from "electron";
import drillConfigurationsFromJson from "../data/DrillConfigurations.json";
import averageShotsFromTeeCsvPath from "../data/tee.csv";
import averageShotsFromFairwayCsvPath from "../data/fairway.csv";
import averageShotsFromRoughCsvPath from "../data/rough.csv";
import averageShotsFromGreenCsvPath from "../data/green.csv";
import {AverageStrokesData, AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "./model/AverageStrokesData";
import {SelectDrillPage, SelectDrillPageName} from "./views/SelectDrillPage/SelectDrillPage";

const App: React.FC<{}> = (): JSX.Element => {
    // page that is currently visible
    const [selectedPage, setSelectedPage] = React.useState<string>(SelectDrillPageName);

    const lastShotCsvPath: string = process.platform !== 'darwin'
        ? "C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV"
        : "/Users/rehn/WebstormProjects/ApproachShot/test/data/LastShot.CSV";

    const [drillConfigurations, setDrillConfigurations] = React.useState<IDrillConfiguration[]>([]);
    const [selectedDrillConfiguration, setSelectedDrillConfiguration] = React.useState<IDrillConfiguration>();
    console.log("selectedDistancesGenerator", selectedDrillConfiguration);

    const [averageStrokesDataMap, setAverageStrokesDataMap] =
        React.useState<Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>>(new Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>());

    React.useEffect((): void => {
        const importCsv = async (averageShotsGroundTypeEnum: AverageStrokesDataGroundTypeEnum, filePath: string, unit: string): Promise<void> => {
            const distancesAndStrokes: [number[], number[]] = await parseCsvToArrayOfColumnArrays(filePath);
            const averageStrokesData: IAverageStrokesData = new AverageStrokesData(averageShotsGroundTypeEnum, distancesAndStrokes[0], unit, distancesAndStrokes[1]);
            averageStrokesDataMap.set(averageShotsGroundTypeEnum, averageStrokesData);
            setAverageStrokesDataMap(new Map(averageStrokesDataMap));
        }

        const appPath = ipcRenderer.sendSync('appPath', undefined);
        importCsv(AverageStrokesDataGroundTypeEnum.Tee, path.join(appPath, '.webpack/renderer', averageShotsFromTeeCsvPath), "yard");
        importCsv(AverageStrokesDataGroundTypeEnum.Fairway, path.join(appPath, '.webpack/renderer', averageShotsFromFairwayCsvPath), "yard");
        importCsv(AverageStrokesDataGroundTypeEnum.Rough, path.join(appPath, '.webpack/renderer', averageShotsFromRoughCsvPath), "yard");
        importCsv(AverageStrokesDataGroundTypeEnum.Green, path.join(appPath, '.webpack/renderer', averageShotsFromGreenCsvPath), "feet");
    }, [])

    React.useEffect((): void => {
        const drillConfigurationsWithDistanceGenerators: IDrillConfiguration[] =
            drillConfigurationsFromJson
                .map((drillConfiguration): IDrillConfiguration => {
                    switch (drillConfiguration.distanceGenerator.type) {
                        case "RandomDistancesGenerator":
                            return new DrillConfigurationWithRandomDistancesGenerator(
                                drillConfiguration.name,
                                drillConfiguration.description,
                                drillConfiguration.distanceGenerator.minIncludedDistance,
                                drillConfiguration.distanceGenerator.maxExcludedDistance,
                                drillConfiguration.unit,
                                drillConfiguration.distanceGenerator.numberOfShots,
                                drillConfiguration.startGroundType,
                                drillConfiguration.endGroundTypes,
                                averageStrokesDataMap);
                        case "FixedDistancesGenerator":
                            return new DrillConfigurationWithFixedDistancesGenerator(
                                drillConfiguration.name,
                                drillConfiguration.description,
                                drillConfiguration.distanceGenerator.distances,
                                drillConfiguration.unit,
                                drillConfiguration.distanceGenerator.numberOfRounds,
                                drillConfiguration.startGroundType,
                                drillConfiguration.endGroundTypes,
                                averageStrokesDataMap);
                        case "RandomFromFixedDistancesGenerator":
                            return new DrillConfigurationWithRandomFromFixedDistancesGenerator(
                                drillConfiguration.name,
                                drillConfiguration.description,
                                drillConfiguration.distanceGenerator.distances,
                                drillConfiguration.unit,
                                drillConfiguration.distanceGenerator.numberOfRounds,
                                drillConfiguration.startGroundType,
                                drillConfiguration.endGroundTypes,
                                averageStrokesDataMap);
                    }
                })
                .filter(distancesGenerator => !!distancesGenerator);
        setDrillConfigurations(drillConfigurationsWithDistanceGenerators);
        setSelectedDrillConfiguration(drillConfigurationsWithDistanceGenerators[0]);
    }, [drillConfigurationsFromJson, averageStrokesDataMap]);

    return (
        <div className="app">
            {selectedPage === SelectDrillPageName
                ? <SelectDrillPage
                    distancesGenerators={drillConfigurations}
                    handleDistancesGeneratorsChanged={(distancesGenerators: IDrillConfiguration[]): void => {
                        setDrillConfigurations(distancesGenerators);
                    }}
                    selectedDistancesGenerator={selectedDrillConfiguration}
                    handleSelectedDistancesGeneratorChanged={(selectedDistancesGenerator: IDrillConfiguration): void => {
                        setSelectedDrillConfiguration(selectedDistancesGenerator)
                    }}
                    handleSelectPageClicked={setSelectedPage}
                />
                : selectedPage === SettingsPageName
                    ? <SettingsPage
                        drillConfigurations={drillConfigurations}
                        handleDrillConfigurationsChanged={(distancesGenerators: IDrillConfiguration[]): void => {
                            setDrillConfigurations(distancesGenerators);
                        }}
                        selectedDrillConfiguration={selectedDrillConfiguration}
                        handleSelectedDrillConfigurationChanged={(selectedDistancesGenerator: IDrillConfiguration): void => {
                            setSelectedDrillConfiguration(selectedDistancesGenerator)
                        }}
                        handleSelectPageClicked={setSelectedPage}
                    />
                    : selectedPage === DrillPageName
                        ? <DrillPage
                            lastShotCsvPath={lastShotCsvPath}
                            selectedDistancesGenerator={selectedDrillConfiguration}
                            handleSelectPageClicked={setSelectedPage}
                        />
                        : null
            }
        </div>
    );
}

export default hot(module)(App);
