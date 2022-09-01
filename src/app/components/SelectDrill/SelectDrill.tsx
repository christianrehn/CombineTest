import React from 'react';
import './SelectDrill.scss';
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import editIcon from '../../../assets/edit.png';
import glassesIcon from "../../../assets/glasses.png";
import {DrillTile} from "./DrillTile/DrillTile";
import {IPlayer} from "../../model/Player/Player";

interface ISelectDrillProps {
    players: IPlayer[];
    selectedPlayer: IPlayer;
    drillConfigurations: IDrillConfiguration[];
    handleDrillConfigurationsChanged: (drillConfigurations: IDrillConfiguration[]) => void;
    selectedDrillConfiguration: IDrillConfiguration;
    tileClickedHandler: (drillConfiguration: IDrillConfiguration, editMode: boolean) => void;
}

export const SelectDrill: React.FC<ISelectDrillProps> = (props: ISelectDrillProps): JSX.Element => {
    const [editMode, setEditMode] = React.useState<boolean>(false);


    return (
        <div className="select-drill-page page">
            <div className="select-drill-top">
                <div className="select-drill-flex-item">
                    <div className="column-header">
                        <h3>Drills</h3>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
                    <div className="edit-flex-item flex-item">
                        <span className="edit-span"
                              onClick={(): void => {
                                  setEditMode(!editMode);
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={editMode ? glassesIcon : editIcon}
                                     alt={editMode ? "Show" : "Edit"}
                                />
                            </div>
                        </span>
                    </div>
                </div>
            </div>

            <div className="drill-tiles-flex-item">
                { // existing configurations
                    !props.selectedPlayer
                        ? props.players.length > 0 ? <div className="drill-tiles-message">Please select a Player</div> :
                            <div className="drill-tiles-message">Please create and select a Player</div>
                        : props.drillConfigurations.map((drillConfiguration: IDrillConfiguration, index: number) =>
                            <DrillTile
                                key={`DrillTile_${index}`}
                                drillConfiguration={drillConfiguration}
                                editMode={editMode}
                                handleTileClicked={props.tileClickedHandler}
                            />)
                }
                { // additional tile to add a new configuration
                    !props.selectedPlayer ? null :
                        editMode ?
                            <DrillTile
                                key={`DrillTile_add`}
                                drillConfiguration={null}
                                editMode={editMode}
                                handleTileClicked={props.tileClickedHandler}
                            />
                            : null
                }
            </div>
        </div>
    );
}
