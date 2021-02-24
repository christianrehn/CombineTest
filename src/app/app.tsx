import {hot} from 'react-hot-loader';
import * as React from 'react';
import './App.scss';
import {SettingsPage} from "./views/SettingsPage/SettingsPage";
import {MainPage} from "./views/MainPage/MainPage";
import {FixedDistances, RandomDistances, RandomFromFixedDistances} from "./util/Distances";

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
                    numberOfShots={18}
                    // distances={new RandomDistances()}
                    // distances={new FixedDistances()}
                    distances={new RandomFromFixedDistances()}
                />
            }
        </div>
    );
}

export default hot(module)(App);
