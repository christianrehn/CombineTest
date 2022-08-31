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

export const HomePageName: string = "HomePage";

interface IHomePageProps {
    players: IPlayer[];
    selectedPlayer: IPlayer;
    handlePlayersChanged: (players: IPlayer[]) => void;
    handleSelectedPlayerChanged: (player: IPlayer) => void;
    sessions: ISession[];
    drillConfigurations: IDrillConfiguration[];
    handleDrillConfigurationsChanged: (drillConfigurations: IDrillConfiguration[]) => void;
    selectedDrillConfiguration: IDrillConfiguration;
    handleSelectedDrillConfigurationChanged: (drillConfiguration: IDrillConfiguration) => void;
    handleSelectPageClicked: (page: string) => void;
}

export const HomePage: React.FC<IHomePageProps> = (props: IHomePageProps): JSX.Element => {
    const [editMode, setEditMode] = React.useState<boolean>(false);

    return (
        <div className="home-page page">
            <div className="home-top">
                <div className="home-flex-item flex-item">
                    <div className="page-header">
                        <h3>Home</h3>
                    </div>
                </div>

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
                <SelectSession sessions={props.sessions}/>
                <SelectDrill
                    drillConfigurations={props.drillConfigurations}
                    handleDrillConfigurationsChanged={props.handleDrillConfigurationsChanged}
                    selectedDrillConfiguration={props.selectedDrillConfiguration}
                    tileClickedHandler={(drillConfiguration: IDrillConfiguration, editMode: boolean): void => {
                        props.handleSelectedDrillConfigurationChanged(drillConfiguration);
                        // switch to other page
                        props.handleSelectPageClicked(editMode ? EditDrillConfigurationPageName : DrillPageName);
                    }}
                />
            </div>
        </div>
    );
}
