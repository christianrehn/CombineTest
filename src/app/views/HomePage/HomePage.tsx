import React from 'react';
import './HomePage.scss';
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import exitIcon from '../../../assets/exit.png';
import {ipcRenderer} from "electron";
import {SelectDrill} from "../../components/SelectDrill/SelectDrill";
import {SelectSession} from "../../components/SelectSession/SelectSession";
import {ISession} from "../../model/Session/Session";
import {SelectPlayer} from "../../components/SelectPlayer/SelectPlayer";
import {IPlayer} from "../../model/Player/Player";
import {EditDrillConfigurationPageName} from "../EditDrillConfigurationPage/EditDrillConfigurationPage";
import {DrillPageName} from "../DrillPage/DrillPage";
import {EditPlayerPageName} from "../EditPlayerPage/EditPlayerPage";
import {assert} from "chai";
import packageJson from '../../../../package.json';
import settingsIcon from "../../../assets/settings.png";
import {EditAppSettingsPageName} from "../EditAppSetttingsPage/EditAppSettingsPage";
import {parseCsvToAllRowsAsObjects} from "../../util/CsvParser";
import {IAppSettings} from "../../model/AppSettings/AppSettings";
import {eventReadAllShotsUpdateType, pollingShotsUpdateType} from "../../model/SelectValues/ShotsUpdateType";

export const HomePageName: string = "HomePage";

interface IHomePageProps {
    appSettings: IAppSettings;
    lastShotCsvPath: string;
    players: IPlayer[];
    selectedPlayer: IPlayer;
    handlePlayersChanged: (players: IPlayer[]) => void;
    handleSelectedPlayerChanged: (player: IPlayer) => void;
    sessions: ISession[];
    selectedSession: ISession;
    handleSelectedSessionChanged: (session: ISession) => void;
    drillConfigurations: IDrillConfiguration[];
    handleDrillConfigurationsChanged: (drillConfigurations: IDrillConfiguration[]) => void;
    selectedDrillConfiguration: IDrillConfiguration;
    handleSelectedDrillConfigurationChanged: (drillConfiguration: IDrillConfiguration) => void;
    handleSelectPageClicked: (page: string, allShotDataIdsBeforeSession?: number[]) => void;
}

export const HomePage: React.FC<IHomePageProps> = (props: IHomePageProps): JSX.Element => {
    const [editMode, setEditMode] = React.useState<boolean>(false);

    const version: string = packageJson?.version;

    return (
        <div className="home-page page">
            <div className="home-top">
                <div className="top-buttons-flex-item">
                    <div className="exit-flex-item flex-item">
                        <span className="exit-span"
                              onClick={(): void => {
                                  ipcRenderer.sendSync('quit', 'undefined');
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={exitIcon}
                                     alt="Exit"
                                />
                            </div>
                        </span>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
                    <div className="reports-flex-item flex-item">
                        <span className="reports-span"
                              onClick={(): void => {
                                  props.handleSelectPageClicked(EditAppSettingsPageName)
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={settingsIcon}
                                     alt={"Settings"}
                                />
                            </div>
                        </span>
                    </div>
                </div>

                <div className="home-flex-item flex-item">
                    <div className="page-header">
                        <h3>Combine Test{!!version ? ` v${version}` : ""}</h3>
                    </div>
                </div>
            </div>

            <div className="home-main">
                <SelectPlayer
                    players={props.players}
                    selectedPlayer={props.selectedPlayer}
                    tileClickedHandler={(player: IPlayer, editMode: boolean): void => {
                        props.handleSelectedPlayerChanged(player);
                        if (editMode) {
                            // switch to other page
                            props.handleSelectPageClicked(EditPlayerPageName);
                        }
                    }}
                />
                <SelectDrill
                    players={props.players}
                    selectedPlayer={props.selectedPlayer}
                    drillConfigurations={props.drillConfigurations}
                    handleDrillConfigurationsChanged={props.handleDrillConfigurationsChanged}
                    selectedDrillConfiguration={props.selectedDrillConfiguration}
                    tileClickedHandler={async (drillConfiguration: IDrillConfiguration, editMode: boolean): Promise<void> => {
                        props.handleSelectedDrillConfigurationChanged(drillConfiguration);

                        // check what is already inside the lastShotData csv file when new session starts
                        const allShotDataIdsBeforeSession: number[] =
                            ([eventReadAllShotsUpdateType, pollingShotsUpdateType].includes(props.appSettings.getShotsUpdateType()))
                                ? (await parseCsvToAllRowsAsObjects(props.lastShotCsvPath)).map(shotDataBeforeSession => shotDataBeforeSession["shot_id"])
                                : [];

                        // switch to other page
                        props.handleSelectPageClicked(editMode ? EditDrillConfigurationPageName : DrillPageName, allShotDataIdsBeforeSession);
                    }}
                />
                <SelectSession
                    selectedPlayer={props.selectedPlayer}
                    sessions={props.sessions}
                    selectedSession={props.selectedSession}
                    tileClickedHandler={(session: ISession, editMode: boolean): void => {
                        assert(!editMode, "!!editMode")

                        props.handleSelectedSessionChanged(session);
                    }}
                    handleSelectPageClicked={props.handleSelectPageClicked}
                />
            </div>
        </div>
    );
}
