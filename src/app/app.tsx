import {hot} from 'react-hot-loader';
import * as React from 'react';
import {Dispatch, SetStateAction} from 'react';
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
import {parseCsv} from "./model/CsvParser";
import * as path from "path";
import {ipcRenderer} from "electron";
import averageShotsFromTeeCsvPath from "../data/tee.csv";
import averageShotsFromFairwayCsvPath from "../data/fairway.csv";
import averageShotsFromGreenCsvPath from "../data/green.csv";

const App: React.FC<{}> = (): JSX.Element => {
    const [showSettings, setShowSettings] = React.useState<boolean>(false);

    const lastShotCsvPath: string = process.platform !== 'darwin'
        ? "C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV"
        : "/Users/rehn/WebstormProjects/ApproachShot/test/data/LastShot.CSV";

    const [distancesGenerators, setDistancesGenerators] = React.useState<IDistancesGenerator[]>([
        new RandomFromFixedDistancesGenerator(BGV_DISTANCES, "meter"),
        new FixedDistancesGenerator(BGV_DISTANCES, "meter"),
        new RandomFromFixedDistancesGenerator([10, 20, 30, 40, 50, 60, 70], "yards"),
        new RandomDistancesGenerator(2, 5, "yards"),
    ]);
    const [selectedDistancesGenerator, setSelectedDistancesGenerator] =
        React.useState<IDistancesGenerator>(distancesGenerators[0]);

    const [numberOfShots, setNumberOfShots] = React.useState<number>(selectedDistancesGenerator.getNumberOfDistances() * 2);

    const [averageShotsFromTee, setAverageShotsFromTee] = React.useState<any>();
    const [averageShotsFromFairway, setAverageShotsFromFairway] = React.useState<any>();
    const [averageShotsFromGreen, setAverageShotsFromGreen] = React.useState<any>();

    React.useEffect((): void => {
        const importCsv = async (filePath: string, setAverageShots: Dispatch<SetStateAction<any>>): Promise<void> => {
            setAverageShots(await parseCsv(filePath));
        }

        const appPath = ipcRenderer.sendSync('appPath', undefined);
        importCsv(path.join(appPath, '.webpack/renderer', averageShotsFromTeeCsvPath), setAverageShotsFromTee);
        importCsv(path.join(appPath, '.webpack/renderer', averageShotsFromFairwayCsvPath), setAverageShotsFromFairway);
        importCsv(path.join(appPath, '.webpack/renderer', averageShotsFromGreenCsvPath), setAverageShotsFromGreen);
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
                    averageShotsFromTee={averageShotsFromTee}
                    averageShotsFromFairway={averageShotsFromFairway}
                    averageShotsFromGreen={averageShotsFromGreen}
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
