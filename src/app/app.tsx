import {hot} from 'react-hot-loader';
import * as React from 'react';
import './App.scss';
import {SettingsPage} from "./views/SettingsPage/SettingsPage";
import {MainPage} from "./views/MainPage/MainPage";
import {
    ITestConfiguration,
    TestConfigurationWithFixedDistancesGenerator,
    TestConfigurationWithRandomDistancesGenerator,
    TestConfigurationWithRandomFromFixedDistancesGenerator
} from "./model/TestConfiguration";
import {parseCsvToArrayOfColumnArrays} from "./util/CsvParser";
import * as path from "path";
import {ipcRenderer} from "electron";
import testsConfigurations from "../data/TestsConfiguration.json";
import averageShotsFromTeeCsvPath from "../data/tee.csv";
import averageShotsFromFairwayCsvPath from "../data/fairway.csv";
import averageShotsFromRoughCsvPath from "../data/rough.csv";
import averageShotsFromGreenCsvPath from "../data/green.csv";
import {AverageStrokesData, AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "./model/AverageStrokesData";

const App: React.FC<{}> = (): JSX.Element => {
    const [showSettings, setShowSettings] = React.useState<boolean>(false);

    const lastShotCsvPath: string = process.platform !== 'darwin'
        ? "C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV"
        : "/Users/rehn/WebstormProjects/ApproachShot/test/data/LastShot.CSV";

    const [distancesGenerators, setDistancesGenerators] = React.useState<ITestConfiguration[]>([]);
    const [selectedDistancesGenerator, setSelectedDistancesGenerator] = React.useState<ITestConfiguration>();

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
        const distancesGenerators: ITestConfiguration[] =
            testsConfigurations
                .map((testsConfiguration): ITestConfiguration => {
                    switch (testsConfiguration.distanceGenerator.type) {
                        case "RandomDistancesGenerator":
                            return new TestConfigurationWithRandomDistancesGenerator(
                                testsConfiguration.description,
                                testsConfiguration.distanceGenerator.minIncludedDistance,
                                testsConfiguration.distanceGenerator.maxExcludedDistance,
                                testsConfiguration.unit,
                                testsConfiguration.distanceGenerator.numberOfShots,
                                testsConfiguration.startGroundType,
                                testsConfiguration.endGroundTypes,
                                averageStrokesDataMap);
                        case "FixedDistancesGenerator":
                            return new TestConfigurationWithFixedDistancesGenerator(
                                testsConfiguration.description,
                                testsConfiguration.distanceGenerator.distances,
                                testsConfiguration.unit,
                                testsConfiguration.distanceGenerator.numberOfRounds,
                                testsConfiguration.startGroundType,
                                testsConfiguration.endGroundTypes,
                                averageStrokesDataMap);
                        case "RandomFromFixedDistancesGenerator":
                            return new TestConfigurationWithRandomFromFixedDistancesGenerator(
                                testsConfiguration.description,
                                testsConfiguration.distanceGenerator.distances,
                                testsConfiguration.unit,
                                testsConfiguration.distanceGenerator.numberOfRounds,
                                testsConfiguration.startGroundType,
                                testsConfiguration.endGroundTypes,
                                averageStrokesDataMap);
                    }
                })
                .filter(distancesGenerator => !!distancesGenerator);
        setDistancesGenerators(distancesGenerators);
        setSelectedDistancesGenerator(distancesGenerators[0]);
    }, [testsConfigurations, averageStrokesDataMap]);



    return (
        <div className="app">
            {showSettings
                ? <SettingsPage
                    distancesGenerators={distancesGenerators}
                    handleDistancesGeneratorsChanged={(distancesGenerators: ITestConfiguration[]): void => {
                        setDistancesGenerators(distancesGenerators);
                    }
                    }
                    selectedDistancesGenerator={selectedDistancesGenerator}
                    handleDistancesGeneratorChanged={(selectedDistancesGenerator: ITestConfiguration): void => {
                        setSelectedDistancesGenerator(selectedDistancesGenerator)
                    }}
                    handleMainClicked={(): void => {
                        setShowSettings(false);
                    }}

                />
                : <MainPage
                    lastShotCsvPath={lastShotCsvPath}
                    selectedDistancesGenerator={selectedDistancesGenerator}
                    handleSettingsClicked={(): void => {
                        setShowSettings(true);
                    }
                    }
                />
            }
        </div>
    );
}

export default hot(module)(App);
