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
import {assert} from "chai";
import {Fairway, Green, Rough, Tee} from "./model/AverageStrokesData/GroundType";
import {
    loadUserDrillConfigurationsAsJson,
    saveUserDrillConfigurations
} from "./model/DrillConfiguration/DrillConfigurationsFilesystemHandler";
import {loadPlayersAsJson, savePlayers} from "./model/Player/PlayersFilesystemHandler";
import {loadSessionsAsJson, saveSessions} from "./model/Session/SessionsFilesystemHandler";
import {ISession} from "./model/Session/Session";
import {sessionsFromJson} from "./model/Session/SessionConverter";
import {ReportsPage, ReportsPageName} from "./views/ReportsPage/ReportsPage";
import {HomePage, HomePageName} from "./views/HomePage/HomePage";
import {IPlayer} from "./model/Player/Player";
import {playersFromJson} from "./model/Player/PlayerConverter";

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
        const userDrillConfigurationsAsJson: any[] = loadUserDrillConfigurationsAsJson();
        const drillConfigurationsAsJson: any[] = !!userDrillConfigurationsAsJson && userDrillConfigurationsAsJson.length > 0
            ? userDrillConfigurationsAsJson
            : predefinedDrillConfigurationsAsJson;
        const drillConfigurations: IDrillConfiguration[] = drillConfigurationsFromJson(drillConfigurationsAsJson, averageStrokesDataMap);
        setDrillConfigurations(drillConfigurations);
    }, [predefinedDrillConfigurationsAsJson, averageStrokesDataMap]);

    const handleDrillConfigurationsChanged = (drillConfigurations: IDrillConfiguration[]): void => {
        setDrillConfigurations(drillConfigurations);
    }

    const handleSelectedDrillConfigurationChanged = (drillConfiguration: IDrillConfiguration): void => {
        !!drillConfiguration
            ? setSelectedDrillConfiguration(drillConfiguration)
            : setSelectedDrillConfiguration(new EmptyDrillConfiguration(averageStrokesDataMap));
    }

    const handleSaveUserDrillConfigurations = (changedDrillConfiguration: IDrillConfiguration): void => {
        const drillConfigurationsClone: IDrillConfiguration[] = [...drillConfigurations];
        const drillConfigurationUuids: string[] = drillConfigurationsClone.map((drillConfiguration: IDrillConfiguration) => drillConfiguration.getUuid());
        console.log("handleSaveUserDrillConfigurations - drillConfigurationUuids=", drillConfigurationUuids);

        if (!changedDrillConfiguration) {
            // selectedDrillConfiguration has been deleted
            const deletedDrillConfigurationIndex: number = drillConfigurationUuids.indexOf(selectedDrillConfiguration.getUuid())
            console.log("handleSaveUserDrillConfigurations - deletedDrillConfigurationIndex=", deletedDrillConfigurationIndex);
            assert(deletedDrillConfigurationIndex >= 0, "deletedDrillConfigurationIndex < 0");
            drillConfigurationsClone.splice(deletedDrillConfigurationIndex, 1);
            setSelectedDrillConfiguration(undefined);
        } else {
            // selectedDrillConfiguration has been updated or is new
            assert(!!changedDrillConfiguration.getUuid(), "!changedDrillConfiguration.getUuid()");
            const changedDrillConfigurationIndex: number = drillConfigurationUuids.indexOf(changedDrillConfiguration.getUuid())
            console.log("handleSaveUserDrillConfigurations - changedDrillConfigurationIndex=", changedDrillConfigurationIndex);
            if (changedDrillConfigurationIndex >= 0) {
                drillConfigurationsClone[changedDrillConfigurationIndex] = changedDrillConfiguration; // replace with changed entry
            } else {
                drillConfigurationsClone.push(changedDrillConfiguration); // new entry
            }
            setSelectedDrillConfiguration(changedDrillConfiguration);
        }

        setDrillConfigurations(drillConfigurationsClone);
        saveUserDrillConfigurations(drillConfigurationsClone);
    }

    React.useEffect((): void => {
        const playersAsJson: any[] = loadPlayersAsJson();
        const players: IPlayer[] = playersFromJson(playersAsJson || []);
        setPlayers(players);
    }, []);

    const handleSavePlayers = (player: IPlayer): void => {
        assert(!!player, "!player");

        console.log("handleSavePlayers - player=", player);
        setSelectedPlayer(player);

        const playersClone: IPlayer[] = [...players];
        playersClone.push(player);
        setPlayers(playersClone);

        savePlayers(playersClone);
    }

    React.useEffect((): void => {
        const sessionsAsJson: any[] = loadSessionsAsJson();
        const sessions: ISession[] = sessionsFromJson(sessionsAsJson || []);
        setSessions(sessions);
    }, []);

    const handleSaveSessions = (session: ISession): void => {
        assert(!!session, "!session");

        console.log("handleSaveSessions - session=", session);
        setSelectedSession(session);

        const sessionsClone: ISession[] = [...sessions];
        sessionsClone.push(session);
        setSessions(sessionsClone);

        saveSessions(sessionsClone);
    }

    return (
        <div className="app">
            {selectedPage === HomePageName
                ? <HomePage
                    players={players}
                    sessions={sessions}
                    drillConfigurations={drillConfigurations}
                    handleDrillConfigurationsChanged={handleDrillConfigurationsChanged}
                    selectedDrillConfiguration={selectedDrillConfiguration}
                    handleSelectedDrillConfigurationChanged={handleSelectedDrillConfigurationChanged}
                    handleSelectPageClicked={setSelectedPage}
                />
                : selectedPage === EditDrillConfigurationPageName
                    ? <EditDrillConfigurationPage
                        selectedDrillConfiguration={selectedDrillConfiguration}
                        handleBackClicked={() => setSelectedPage(HomePageName)}
                        handleSaveDrillConfigurations={handleSaveUserDrillConfigurations}
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
                        : selectedPage === ReportsPageName
                            ? <ReportsPage
                                handleBackClicked={() => setSelectedPage(HomePageName)}
                            />
                            : null
            }
        </div>
    );
}

export default hot(module)(App);
