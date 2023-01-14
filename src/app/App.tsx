import {hot} from 'react-hot-loader';
import * as React from 'react';
import './App.scss';
import {
    EditDrillConfigurationPage,
    EditDrillConfigurationPageName
} from "./views/EditDrillConfigurationPage/EditDrillConfigurationPage";
import {DrillPage, DrillPageName} from "./views/DrillPage/DrillPage";
import {EmptyDrillConfiguration, IDrillConfiguration} from "./model/DrillConfiguration/DrillConfiguration";
import {parseCsvToArrayOfColumnArrays} from "./util/CsvParser";
import * as path from "path";
import {ipcRenderer} from "electron";
import predefinedDrillConfigurationsAsJson from "../data/PredefinedDrillConfigurations.json";
import averageShotsFromTeeCsvPath from "../data/tee.csv";
import averageShotsFromFairwayCsvPath from "../data/fairway.csv";
import averageShotsFromRoughCsvPath from "../data/rough.csv";
import averageShotsFromGreenCsvPath from "../data/green.csv";
import {AverageStrokesData, IAverageStrokesData} from "./model/AverageStrokesData/AverageStrokesData";
import {drillConfigurationsFromJson} from "./model/DrillConfiguration/DrillConfigurationConverter";
import {Fairway, Green, Rough, Tee} from "./model/AverageStrokesData/GroundType";
import {
    loadUserDrillConfigurationsAsJson,
    LoadUserDrillConfigurationsAsJsonReturnType,
    saveUserDrillConfigurations
} from "./model/DrillConfiguration/DrillConfigurationsFilesystemHandler";
import {loadPlayersAsJson, LoadPlayersAsJsonReturnType, savePlayers} from "./model/Player/PlayersFilesystemHandler";
import {
    loadSessionsAsJson,
    LoadSessionsAsJsonReturnType,
    saveSessions
} from "./model/Session/SessionsFilesystemHandler";
import {ISession} from "./model/Session/Session";
import {sessionsFromJson} from "./model/Session/SessionConverter";
import {HomePage, HomePageName} from "./views/HomePage/HomePage";
import {IPlayer, Player} from "./model/Player/Player";
import {playersFromJson} from "./model/Player/PlayerConverter";
import {v4 as uuidv4} from "uuid";
import {EditPlayerPage, EditPlayerPageName} from "./views/EditPlayerPage/EditPlayerPage";
import {Entity} from "./model/base/Entity";
import {assert} from "chai";
import {ReportSessionPage, ReportSessionPageName} from "./views/ReportSessionPage/ReportSessionPage";
import {EditAppSettingsPage, EditAppSettingsPageName} from "./views/EditAppSetttingsPage/EditAppSettingsPage";
import {IAppSettings} from "./model/AppSettings/AppSettings";
import {
    loadAppSettingsAsJson,
    LoadAppSettingsAsJsonReturnType,
    saveAppSettings
} from "./model/AppSettings/AppSettingsFilesystemHandler";
import {appSettingsFromJson} from "./model/AppSettings/AppSettingsConverter";
import {
    EditDrillConfigurationsPage,
    EditDrillConfigurationsPageName
} from "./views/EditDrillConfigurationsPage/EditDrillConfigurationsPage";
import {PageNamesType} from "./views/PageNamesType";

const App: React.FC<{}> = (): JSX.Element => {
    // page that is currently visible

    const [selectedPage, setSelectedPage] = React.useState<PageNamesType>(HomePageName);

    const lastShotCsvPath: string = process.platform !== 'darwin'
        ? "C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV"
        : "/Users/rehn/IdeaProjects/GCQuadCombineTest/test/data/LastShot.CSV";
    const fsx2020SessionJsonDir: string = process.platform !== 'darwin'
        ? "C:/Program Files (x86)/Foresight Sports Experience/SessionData/"
        : "/Users/rehn/IdeaProjects/GCQuadCombineTest/test/data/SessionData/";

    const [appSettingsFilename, setAppSettingsFilename] = React.useState<string>("");
    const [appSettings, setAppSettings] = React.useState<IAppSettings>(undefined);

    const [userDrillConfigurationsFilename, setUserDrillConfigurationsFilename] = React.useState<string>("");
    const [drillConfigurations, setDrillConfigurations] = React.useState<IDrillConfiguration[]>([]);
    const [selectedDrillConfiguration, setSelectedDrillConfiguration] = React.useState<IDrillConfiguration>();

    const [playersFilename, setPlayersFilename] = React.useState<string>("");
    const [players, setPlayers] = React.useState<IPlayer[]>([]);
    const [selectedPlayer, setSelectedPlayer] = React.useState<IPlayer>(undefined);

    const [sessionsFilename, setSessionsFilename] = React.useState<string>("");
    const [sessions, setSessions] = React.useState<ISession[]>([]);
    const [selectedSession, setSelectedSession] = React.useState<ISession>(undefined);

    const [averageStrokesDataMap, setAverageStrokesDataMap] =
        React.useState<Map<string, IAverageStrokesData>>(new Map<string, IAverageStrokesData>());

    React.useEffect((): void => {
        const {appSettingsFilename, appSettingsAsJson}: LoadAppSettingsAsJsonReturnType = loadAppSettingsAsJson();
        setAppSettingsFilename(appSettingsFilename);
        const appSettings: IAppSettings = appSettingsFromJson(appSettingsAsJson || {});
        setAppSettings(appSettings);
    }, []);

    React.useEffect((): void => {
        const importCsv = async (averageShotsGroundType: string, filePath: string, unit: string): Promise<void> => {
            const distancesAndStrokes: [number[], number[]] = await parseCsvToArrayOfColumnArrays(filePath);
            const averageStrokesData: IAverageStrokesData = new AverageStrokesData(averageShotsGroundType, distancesAndStrokes[0], unit, distancesAndStrokes[1]);
            averageStrokesDataMap.set(averageShotsGroundType, averageStrokesData);
            setAverageStrokesDataMap(new Map(averageStrokesDataMap));
        }

        const appPath: string = ipcRenderer.sendSync('appPath', undefined);
        importCsv(Tee, path.join(appPath, '.webpack/renderer', averageShotsFromTeeCsvPath), "yard");
        importCsv(Fairway, path.join(appPath, '.webpack/renderer', averageShotsFromFairwayCsvPath), "yard");
        importCsv(Rough, path.join(appPath, '.webpack/renderer', averageShotsFromRoughCsvPath), "yard");
        importCsv(Green, path.join(appPath, '.webpack/renderer', averageShotsFromGreenCsvPath), "feet");
    }, [averageShotsFromTeeCsvPath, averageShotsFromFairwayCsvPath, averageShotsFromRoughCsvPath, averageShotsFromGreenCsvPath])

    React.useEffect((): void => {
        const {playersFilename, playersAsJson}: LoadPlayersAsJsonReturnType = loadPlayersAsJson();
        setPlayersFilename(playersFilename)
        const players: IPlayer[] = playersFromJson(playersAsJson || []);
        setPlayers(players);
    }, []);


    React.useEffect((): void => {
        const {sessionsFilename, sessionsAsJson}: LoadSessionsAsJsonReturnType = loadSessionsAsJson();
        setSessionsFilename(sessionsFilename);
        const sessions: ISession[] = sessionsFromJson(sessionsAsJson || [], averageStrokesDataMap);
        setSessions(sessions);
    }, []);

    React.useEffect((): void => {
        const {
            userDrillConfigurationsFilename,
            userDrillConfigurationsAsJson
        }: LoadUserDrillConfigurationsAsJsonReturnType = loadUserDrillConfigurationsAsJson();
        setUserDrillConfigurationsFilename(userDrillConfigurationsFilename);
        const drillConfigurationsAsJson: any[] = !!userDrillConfigurationsAsJson && userDrillConfigurationsAsJson.length > 0
            ? userDrillConfigurationsAsJson
            : predefinedDrillConfigurationsAsJson;
        const drillConfigurations: IDrillConfiguration[] = drillConfigurationsFromJson(drillConfigurationsAsJson, averageStrokesDataMap);
        setDrillConfigurations(drillConfigurations);
    }, [predefinedDrillConfigurationsAsJson, averageStrokesDataMap]);

    const handleSaveAppSettings = (changedAppSettings: IAppSettings): void => {
        Entity.handleSaveEntity(
            changedAppSettings,
            setAppSettings,
            saveAppSettings
        )(changedAppSettings);
    }

    const handleSavePlayers = (changedPlayer: IPlayer): void => {
        Entity.handleSaveEntities(
            players,
            setPlayers,
            selectedPlayer,
            setSelectedPlayer,
            savePlayers
        )(changedPlayer);
    }

    const handleSaveSessions = (changedSession: ISession): void => {
        Entity.handleSaveEntities(
            sessions,
            setSessions,
            selectedSession,
            setSelectedSession,
            saveSessions
        )(changedSession);
    }

    const handlePlayersChanged = (players: IPlayer[]): void => {
        setPlayers(players);
    }

    const handleSelectedPlayerChanged = (player: IPlayer): void => {
        !!player
            ? setSelectedPlayer(player)
            : setSelectedPlayer(new Player(uuidv4(), '', ''));
    }

    const handleSelectedSessionChanged = (session: ISession): void => {
        assert(!!session, "!session")

        setSelectedSession(session)
    }

    const handleDrillConfigurationsChanged = (drillConfigurations: IDrillConfiguration[]): void => {
        setDrillConfigurations(drillConfigurations);
    }

    const handleSelectedDrillConfigurationChanged = (drillConfiguration: IDrillConfiguration): void => {
        !!drillConfiguration
            ? setSelectedDrillConfiguration(drillConfiguration)
            : setSelectedDrillConfiguration(new EmptyDrillConfiguration(averageStrokesDataMap));
    }

    const handleSaveDrillConfigurations = (changedDrillConfiguration: IDrillConfiguration): void => {
        Entity.handleSaveEntities(
            drillConfigurations,
            setDrillConfigurations,
            selectedDrillConfiguration,
            setSelectedDrillConfiguration,
            saveUserDrillConfigurations
        )(changedDrillConfiguration);
    }

    return (
        <div className="app">
            {selectedPage === HomePageName
                ? <HomePage
                    appSettings={appSettings}
                    lastShotCsvPath={lastShotCsvPath}
                    players={players}
                    selectedPlayer={selectedPlayer}
                    handlePlayersChanged={handlePlayersChanged}
                    handleSelectedPlayerChanged={handleSelectedPlayerChanged}
                    sessions={sessions}
                    selectedSession={selectedSession}
                    handleSelectedSessionChanged={handleSelectedSessionChanged}
                    drillConfigurations={drillConfigurations}
                    handleDrillConfigurationsChanged={handleDrillConfigurationsChanged}
                    selectedDrillConfiguration={selectedDrillConfiguration}
                    handleSelectedDrillConfigurationChanged={handleSelectedDrillConfigurationChanged}
                    handleSelectPageClicked={setSelectedPage}
                />
                : selectedPage === EditAppSettingsPageName
                    ? <EditAppSettingsPage
                        appSettings={appSettings}
                        lastShotCsvPath={lastShotCsvPath}
                        fsx2020SessionJsonDir={fsx2020SessionJsonDir}
                        appSettingsFilename={appSettingsFilename}
                        playersFilename={playersFilename}
                        userDrillConfigurationsFilename={userDrillConfigurationsFilename}
                        sessionsFilename={sessionsFilename}
                        handleBackClicked={() => setSelectedPage(HomePageName)}
                        handleSaveAppSettings={handleSaveAppSettings}
                    />
                    : selectedPage === EditPlayerPageName
                        ? <EditPlayerPage
                            selectedPlayer={selectedPlayer}
                            handleBackClicked={() => setSelectedPage(HomePageName)}
                            handleSavePlayer={handleSavePlayers}
                        />
                        : selectedPage === EditDrillConfigurationPageName
                            ? <EditDrillConfigurationPage
                                selectedDrillConfiguration={selectedDrillConfiguration}
                                handleBackClicked={() => setSelectedPage(HomePageName)}
                                handleSaveDrillConfiguration={handleSaveDrillConfigurations}
                                averageStrokesDataMap={averageStrokesDataMap}
                            />
                            : selectedPage === EditDrillConfigurationsPageName
                                ? <EditDrillConfigurationsPage
                                    allDrillConfigurations={drillConfigurations}
                                    handleBackClicked={() => setSelectedPage(HomePageName)}
                                    handleSaveDrillConfigurations={() => {
                                        console.log("TODO: save all drill configs")
                                    }}
                                />
                                : selectedPage === ReportSessionPageName
                                    ? <ReportSessionPage
                                        selectedSession={selectedSession}
                                        handleBackClicked={() => setSelectedPage(HomePageName)}
                                    />
                                    : selectedPage === DrillPageName
                                        ? <DrillPage
                                            appSettings={appSettings}
                                            lastShotCsvPath={lastShotCsvPath}
                                            sessionJsonDir={fsx2020SessionJsonDir}
                                            selectedPlayer={selectedPlayer}
                                            selectedSession={selectedSession}
                                            selectedDrillConfiguration={selectedDrillConfiguration}
                                            handleSelectPageClicked={setSelectedPage}
                                            handleSaveSessions={handleSaveSessions}
                                        />
                                        : null
            }
        </div>
    );
}

export default hot(module)(App);
