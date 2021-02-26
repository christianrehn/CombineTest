import {hot} from 'react-hot-loader';
import * as React from 'react';
import './App.scss';
import {SettingsPage} from "./views/SettingsPage/SettingsPage";
import {MainPage} from "./views/MainPage/MainPage";
import {
    BGV_DISTANCES,
    FixedDistancesGenerator,
    RandomDistancesGenerator,
    RandomFromFixedDistancesGenerator
} from "./model/DistancesGenerator";

const App: React.FC<{}> = (): JSX.Element => {
    const [showSettings, setShowSettings] = React.useState<boolean>(false);
    const lastShotCsvPath: string = process.platform !== 'darwin'
        ? "C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV"
        : "/Users/rehn/WebstormProjects/ApproachShot/data/LastShot.CSV";
    return (
        <div className="app">
            {showSettings
                ? <SettingsPage/>
                : <MainPage
                    lastShotCsvPath={lastShotCsvPath}
                    distancesGenerators={[
                        new RandomFromFixedDistancesGenerator(BGV_DISTANCES),
                        new FixedDistancesGenerator(BGV_DISTANCES),
                        new RandomDistancesGenerator(10, 80),
                    ]}
                />
            }
        </div>
    );
}

export default hot(module)(App);
