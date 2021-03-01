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
import {AverageShots, AverageShotsGroundTypeEnum, IAverageShots} from "./model/AverageShots";

const App: React.FC<{}> = (): JSX.Element => {
    const [showSettings, setShowSettings] = React.useState<boolean>(false);

    const lastShotCsvPath: string = process.platform !== 'darwin'
        ? "C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV"
        : "/Users/rehn/WebstormProjects/ApproachShot/test/data/LastShot.CSV";

    const [distancesGenerators, setDistancesGenerators] = React.useState<IDistancesGenerator[]>([
        new RandomFromFixedDistancesGenerator(BGV_DISTANCES, "meter", AverageShotsGroundTypeEnum.Fairway),
        new FixedDistancesGenerator([400], "meter", AverageShotsGroundTypeEnum.Tee),
        new RandomFromFixedDistancesGenerator([10, 20, 30, 40, 50, 60, 70], "yards", AverageShotsGroundTypeEnum.Fairway),
        new RandomDistancesGenerator(10, 10, "yards", AverageShotsGroundTypeEnum.Fairway),
    ]);
    const [selectedDistancesGenerator, setSelectedDistancesGenerator] =
        React.useState<IDistancesGenerator>(distancesGenerators[0]);

    const [numberOfShots, setNumberOfShots] = React.useState<number>(selectedDistancesGenerator.getNumberOfDistances() * 2);

    const [averageShotsMap, setAverageShotsMap] = React.useState<Map<AverageShotsGroundTypeEnum, IAverageShots>>(new Map<AverageShotsGroundTypeEnum, IAverageShots>());

    React.useEffect((): void => {
        const importCsv = async (averageShotsGroundTypeEnum: AverageShotsGroundTypeEnum, filePath: string, unit: string): Promise<void> => {
            const distancesAndStrokes: [number[], number[]] = await parseCsvToArrayOfColumnArrays(filePath);
            const averageShots: IAverageShots = new AverageShots(averageShotsGroundTypeEnum, distancesAndStrokes[0], unit, distancesAndStrokes[1]);
            averageShotsMap.set(averageShotsGroundTypeEnum, averageShots);
            setAverageShotsMap(new Map(averageShotsMap));
        }

        const appPath = ipcRenderer.sendSync('appPath', undefined);
        importCsv(AverageShotsGroundTypeEnum.Tee, path.join(appPath, '.webpack/renderer', averageShotsFromTeeCsvPath), "yard");
        importCsv(AverageShotsGroundTypeEnum.Fairway, path.join(appPath, '.webpack/renderer', averageShotsFromFairwayCsvPath), "yard");
        importCsv(AverageShotsGroundTypeEnum.Green, path.join(appPath, '.webpack/renderer', averageShotsFromGreenCsvPath), "feet");
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
                        setNumberOfShots(selectedDistancesGenerator.getNumberOfDistances() * 2);
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
                    averageShotsMap={averageShotsMap}
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
