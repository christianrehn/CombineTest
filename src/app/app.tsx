import React from 'react';
import './app.scss';
import MainPage from './views/MainPage/MainPage';
import {SettingsPage} from "@/app/views/SettingsPage/SettingsPage";

const App: React.FC<{}> = (): JSX.Element => {
    const [showSettings, setShowSettings] = React.useState<boolean>(true);
    return (
        <div className="app">
            {showSettings ? <SettingsPage/> : <MainPage/>}
        </div>
    );
}

export default App;
