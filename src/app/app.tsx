import {hot} from 'react-hot-loader';
import * as React from 'react';
import {assert} from "chai";
import './App.scss';
import {SettingsPage} from "./views/SettingsPage/SettingsPage";
import {MainPage} from "./views/MainPage/MainPage";
import {
    BGV_DISTANCES,
    FixedDistancesGenerator, IDistancesGenerator,
    RandomDistancesGenerator,
    RandomFromFixedDistancesGenerator
} from "./model/DistancesGenerator";

const App: React.FC<{}> = (): JSX.Element => {
    const [showSettings, setShowSettings] = React.useState<boolean>(false);

    const lastShotCsvPath: string = process.platform !== 'darwin'
        ? "C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV"
        : "/Users/rehn/WebstormProjects/ApproachShot/data/LastShot.CSV";

    const [distancesGenerators, setDistancesGenerators] = React.useState<IDistancesGenerator[]>([
        new RandomFromFixedDistancesGenerator(BGV_DISTANCES),
        new FixedDistancesGenerator(BGV_DISTANCES),
        new RandomDistancesGenerator(2, 5),
    ]);
    const [selectedDistancesGenerator, setSelectedDistancesGenerator] =
        React.useState<IDistancesGenerator>(distancesGenerators[0]);

    const [numberOfShots, setNumberOfShots] = React.useState<number>(selectedDistancesGenerator.getNumberOfDistances() * 2);

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
