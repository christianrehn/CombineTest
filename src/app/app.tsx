import {hot} from 'react-hot-loader';
import * as React from 'react';
import './App.scss';
import {SettingsPage} from "./views/SettingsPage/SettingsPage";
import {MainPage} from "./views/MainPage/MainPage";
import {
    BGV_DISTANCES,
    FixedDistancesGenerator,
    IDistancesGenerator,
    RandomDistancesGenerator,
    RandomFromFixedDistancesGenerator
} from "./model/DistancesGenerator";
import {parseCsvToArrayOfColumnArrays} from "./model/CsvParser";
import * as path from "path";
import {ipcRenderer} from "electron";
import averageShotsFromTeeCsvPath from "../data/tee.csv";
import averageShotsFromFairwayCsvPath from "../data/fairway.csv";
import averageShotsFromGreenCsvPath from "../data/green.csv";
import {AverageStrokesData, AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "./model/AverageStrokesData";

const App: React.FC<{}> = (): JSX.Element => {
    const [showSettings, setShowSettings] = React.useState<boolean>(false);

    const lastShotCsvPath: string = process.platform !== 'darwin'
        ? "C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV"
        : "/Users/rehn/WebstormProjects/ApproachShot/test/data/LastShot.CSV";

    const [distancesGenerators, setDistancesGenerators] = React.useState<IDistancesGenerator[]>([
        new RandomFromFixedDistancesGenerator(BGV_DISTANCES, "meter", AverageStrokesDataGroundTypeEnum.Fairway),
        new FixedDistancesGenerator([400], "meter", AverageStrokesDataGroundTypeEnum.Tee),
        new RandomFromFixedDistancesGenerator([10, 20, 30, 40, 50, 60, 70], "yards", AverageStrokesDataGroundTypeEnum.Fairway),
        new RandomDistancesGenerator(100, 100, "yards", AverageStrokesDataGroundTypeEnum.Fairway),
        new RandomDistancesGenerator(91.44, 91.44, "meter", AverageStrokesDataGroundTypeEnum.Fairway),
    ]);
    const [selectedDistancesGenerator, setSelectedDistancesGenerator] =
        React.useState<IDistancesGenerator>(distancesGenerators[0]);

    const [numberOfShots, setNumberOfShots] = React.useState<number>(selectedDistancesGenerator.numberOfDistances * 2);

    const [averageStrokesDataMap, setAverageStrokesDataMap] = React.useState<Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>>(new Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>());

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
                        setNumberOfShots(selectedDistancesGenerator.numberOfDistances * 2);
                    }}
                    numberOfShots={numberOfShots}
                    handleNumberOfShotsChanged={(numberOfShots: number): void => {
                        setNumberOfShots(numberOfShots)
                    }}
                    handleMainClicked={(): void => {
                        setShowSettings(false);
                    }}

                />
                : <MainPage
                    lastShotCsvPath={lastShotCsvPath}
                    averageStrokesDataMap={averageStrokesDataMap}
                    selectedDistancesGenerator={selectedDistancesGenerator}
                    numberOfShots={numberOfShots}
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
