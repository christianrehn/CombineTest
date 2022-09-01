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
    saveUserDrillConfigurations
} from "./model/DrillConfiguration/DrillConfigurationsFilesystemHandler";
import {loadPlayersAsJson, savePlayers} from "./model/Player/PlayersFilesystemHandler";
import {loadSessionsAsJson, saveSessions} from "./model/Session/SessionsFilesystemHandler";
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

const App: React.FC<{}> = (): JSX.Element => {
    // page that is currently visible
    const [selectedPage, setSelectedPage] = React.useState<string>(HomePageName);

    const lastShotCsvPath: string = process.platform !== 'darwin'
        ? "C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV"
        : "/Users/rehn/IdeaProjects/GCQuadCombineTest/test/data/LastShot.CSV";

    const [drillConfigurations, setDrillConfigurations] = React.useState<IDrillConfiguration[]>([]);
    const [selectedDrillConfiguration, setSelectedDrillConfiguration] = React.useState<IDrillConfiguration>();

    const [players, setPlayers] = React.useState<IPlayer[]>([]);
    const [selectedPlayer, setSelectedPlayer] = React.useState<IPlayer>(undefined);

    const [sessions, setSessions] = React.useState<ISession[]>([]);
    const [selectedSession, setSelectedSession] = React.useState<ISession>(undefined);

    const [averageStrokesDataMap, setAverageStrokesDataMap] =
        React.useState<Map<string, IAverageStrokesData>>(new Map<string, IAverageStrokesData>());

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
        const playersAsJson: any[] = loadPlayersAsJson();
        const players: IPlayer[] = playersFromJson(playersAsJson || []);
        setPlayers(players);
    }, []);


    React.useEffect((): void => {
        const sessionsAsJson: any[] = loadSessionsAsJson();
        const sessions: ISession[] = sessionsFromJson(sessionsAsJson || [], averageStrokesDataMap);
        setSessions(sessions);
    }, []);

    React.useEffect((): void => {
        const userDrillConfigurationsAsJson: any[] = loadUserDrillConfigurationsAsJson();
        const drillConfigurationsAsJson: any[] = !!userDrillConfigurationsAsJson && userDrillConfigurationsAsJson.length > 0
            ? userDrillConfigurationsAsJson
            : predefinedDrillConfigurationsAsJson;
        const drillConfigurations: IDrillConfiguration[] = drillConfigurationsFromJson(drillConfigurationsAsJson, averageStrokesDataMap);
        setDrillConfigurations(drillConfigurations);
    }, [predefinedDrillConfigurationsAsJson, averageStrokesDataMap]);

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
                : selectedPage === EditPlayerPageName
                    ? <EditPlayerPage
                        selectedPlayer={selectedPlayer}
                        handleBackClicked={() => setSelectedPage(HomePageName)}
                        handleSavePlayer={handleSavePlayers}
                    />
                    : selectedPage === ReportSessionPageName
                        ? <ReportSessionPage
                            selectedSession={selectedSession}
                            handleBackClicked={() => setSelectedPage(HomePageName)}
                        />
                        : selectedPage === EditDrillConfigurationPageName
                            ? <EditDrillConfigurationPage
                                selectedDrillConfiguration={selectedDrillConfiguration}
                                handleBackClicked={() => setSelectedPage(HomePageName)}
                                handleSaveDrillConfiguration={handleSaveDrillConfigurations}
                                averageStrokesDataMap={averageStrokesDataMap}
                            />

                            : selectedPage === DrillPageName
                                ? <DrillPage
                                    lastShotCsvPath={lastShotCsvPath}
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
