import {hot} from 'react-hot-loader';
import * as React from 'react';
import './App.scss';
import {SettingsPage} from "./views/SettingsPage/SettingsPage";
import {MainPage} from "./views/MainPage/MainPage";

const App: React.FC<{}> = (): JSX.Element => {
    const [showSettings, setShowSettings] = React.useState<boolean>(false);
    return (
        <div className="app">
            {showSettings
                ? <SettingsPage/>
                : <MainPage
                    lastShotCsvPath={"/Users/rehn/WebstormProjects/ApproachShot/data/LastShot.CSV"}
                />
            }
        </div>
    );
}

export default hot(module)(App);
