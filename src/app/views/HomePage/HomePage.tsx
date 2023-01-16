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
import zoomInIcon from "../../../assets/zoomIn.png";
import zoomOutIcon from "../../../assets/zoomOut.png";
import zoomResetIcon from "../../../assets/zoomReset.png";
import {EditAppSettingsPageName} from "../EditAppSetttingsPage/EditAppSettingsPage";
import {IAppSettings} from "../../model/AppSettings/AppSettings";
import {PageNamesType} from "../PageNamesType";

export const HomePageName: PageNamesType = "HomePage";

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
    handleSelectPageClicked: (page: PageNamesType) => void;
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
                    <div className="edit-app-settings-flex-item flex-item">
                        <span className="edit-app-settings-span"
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

                <div className="top-buttons-flex-item">
                    <div className="zoom-in-flex-item flex-item">
                        <span className="zoom-in-span"
                              onClick={(): void => {
                                  const currentValue: string = (document.body.style as any).zoom || "100%";
                                  const newValueAsNumber: number = Number(currentValue.replace('%', '')) + 10;
                                  (document.body.style as any).zoom = `${Math.min(newValueAsNumber, 200)}%`;
                                  console.log("zoom", (document.body.style as any).zoom)
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={zoomInIcon}
                                     alt={"Zoom In"}
                                />
                            </div>
                        </span>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
                    <div className="zoom-out-flex-item flex-item">
                        <span className="zoom-out-span"
                              onClick={(): void => {
                                  const currentValue: string = (document.body.style as any).zoom || "100%";
                                  const newValueAsNumber: number = Number(currentValue.replace('%', '')) - 10;
                                  (document.body.style as any).zoom = `${Math.max(newValueAsNumber, 30)}%`;
                                  console.log("zoom", (document.body.style as any).zoom)
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={zoomOutIcon}
                                     alt={"Zoom Out"}
                                />
                            </div>
                        </span>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
                    <div className="zoom-reset-flex-item flex-item">
                        <span className="zoom-reset-span"
                              onClick={(): void => {
                                  (document.body.style as any).zoom = "100%";
                                  console.log("zoom", (document.body.style as any).zoom)
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={zoomResetIcon}
                                     alt={"Zoom Reset"}
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

                        // switch to other page
                        props.handleSelectPageClicked(editMode ? EditDrillConfigurationPageName : DrillPageName);
                    }}
                    handleSelectPageClicked={props.handleSelectPageClicked}
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
