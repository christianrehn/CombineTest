import React from 'react';
import './app.scss';
import {SettingsPage} from "@/app/views/SettingsPage/SettingsPage";
import {MainPage} from "@/app/views/MainPage/MainPage";

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

export default App;
