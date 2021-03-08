import {hot} from 'react-hot-loader';
import * as React from 'react';
import './App.scss';
import {SettingsPage} from "./views/SettingsPage/SettingsPage";
import {MainPage} from "./views/MainPage/MainPage";
import {
    FixedDistancesGenerator,
    IDistancesGenerator,
    RandomDistancesGenerator,
    RandomFromFixedDistancesGenerator
} from "./model/DistancesGenerator";
import {parseCsvToArrayOfColumnArrays} from "./util/CsvParser";
import * as path from "path";
import {ipcRenderer} from "electron";
import testsConfigurations from "../data/TestsConfiguration.json";
import averageShotsFromTeeCsvPath from "../data/tee.csv";
import averageShotsFromFairwayCsvPath from "../data/fairway.csv";
import averageShotsFromGreenCsvPath from "../data/green.csv";
import {AverageStrokesData, AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "./model/AverageStrokesData";
// import {parseJson} from "./util/JsonParser";

const App: React.FC<{}> = (): JSX.Element => {
    const [showSettings, setShowSettings] = React.useState<boolean>(false);

    const lastShotCsvPath: string = process.platform !== 'darwin'
        ? "C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV"
        : "/Users/rehn/WebstormProjects/ApproachShot/test/data/LastShot.CSV";

    const [distancesGenerators, setDistancesGenerators] = React.useState<IDistancesGenerator[]>([]);
    const [selectedDistancesGenerator, setSelectedDistancesGenerator] = React.useState<IDistancesGenerator>();

    const [averageStrokesDataMap, setAverageStrokesDataMap] =
        React.useState<Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>>(new Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>());

    React.useEffect((): void => {
        console.log("testsConfigurations", testsConfigurations)
        const distancesGenerators: IDistancesGenerator[] =
            testsConfigurations
                .map((testsConfiguration): IDistancesGenerator => {
                    switch (testsConfiguration.distanceGenerator.type) {
                        case "RandomDistancesGenerator":
                            return new RandomDistancesGenerator(
                                testsConfiguration.distanceGenerator.minIncludedDistance,
                                testsConfiguration.distanceGenerator.maxExcludedDistance,
                                testsConfiguration.unit,
                                testsConfiguration.distanceGenerator.numberOfShots,
                                testsConfiguration.startGroundType);
                        case "FixedDistancesGenerator":
                            return new FixedDistancesGenerator(
                                testsConfiguration.distanceGenerator.distances,
                                testsConfiguration.unit,
                                testsConfiguration.distanceGenerator.numberOfRounds,
                                testsConfiguration.startGroundType);
                        case "RandomFromFixedDistancesGenerator":
                            return new RandomFromFixedDistancesGenerator(
                                testsConfiguration.distanceGenerator.distances,
                                testsConfiguration.unit,
                                testsConfiguration.distanceGenerator.numberOfRounds,
                                testsConfiguration.startGroundType);
                    }
                })
                .filter(distancesGenerator => !!distancesGenerator);
        console.log("distancesGenerators", distancesGenerators);
        setDistancesGenerators(distancesGenerators);
        setSelectedDistancesGenerator(distancesGenerators[0]);
    }, [testsConfigurations]);

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
        importCsv(AverageStrokesDataGroundTypeEnum.Green, path.join(appPath, '.webpack/renderer', averageShotsFromGreenCsvPath), "feet");
    }, [])

    return (
        <div className="app">
            {showSettings
                ? <SettingsPage
                    distancesGenerators={distancesGenerators}
                    handleDistancesGeneratorsChanged={(distancesGenerators: IDistancesGenerator[]): void => {
                        setDistancesGenerators(distancesGenerators);
                    }
                    }
                    selectedDistancesGenerator={selectedDistancesGenerator}
                    handleDistancesGeneratorChanged={(selectedDistancesGenerator: IDistancesGenerator): void => {
                        setSelectedDistancesGenerator(selectedDistancesGenerator)
                    }}
                    handleMainClicked={(): void => {
                        setShowSettings(false);
                    }}

                />
                : <MainPage
                    lastShotCsvPath={lastShotCsvPath}
                    averageStrokesDataMap={averageStrokesDataMap}
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
