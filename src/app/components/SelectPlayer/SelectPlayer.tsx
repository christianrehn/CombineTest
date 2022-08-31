import React from 'react';
import './SelectPlayer.scss';
import {IPlayer} from "../../model/Player/Player";
import editIcon from '../../../assets/edit.png';
import glassesIcon from "../../../assets/glasses.png";
import {PlayerTile} from "./PlayerTile/PlayerTile";

interface ISelectPlayerProps {
    players: IPlayer[];
    selectedPlayer: IPlayer;
    tileClickedHandler: (player: IPlayer, editMode: boolean) => void;
}

export const SelectPlayer: React.FC<ISelectPlayerProps> = (props: ISelectPlayerProps): JSX.Element => {
    const [editMode, setEditMode] = React.useState<boolean>(false);

    return (
        <div className="select-player-page page">
            <div className="select-player-top">
                <div className="select-player-flex-item">
                    <div className="column-header">
                        <h3>Players</h3>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
                    <div className="reports-flex-item flex-item">
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

            <div className="player-tiles-flex-item">
                { // existing players
                    props.players.map((player: IPlayer, index: number) =>
                        <PlayerTile
                            key={`PlayerTile_${index}`}
                            player={player}
                            selectedPlayer={props.selectedPlayer}
                            editMode={editMode}
                            handleTileClicked={props.tileClickedHandler}
                        />)
                }
                { // additional tile to add a new player
                    editMode ?
                        <PlayerTile
                            key={`PlayerTile_add`}
                            player={null}
                            selectedPlayer={props.selectedPlayer}
                            editMode={editMode}
                            handleTileClicked={props.tileClickedHandler}
                        />
                        : null
                }
            </div>
        </div>
    );
}
