import React from "react";
import './PlayerTile.scss';
import {IPlayer} from "../../../model/Player/Player";

export interface IPlayerTileProps {
    player: IPlayer;
    selectedPlayer: IPlayer;
    editMode: boolean;
    handleTileClicked: (player: IPlayer, editMode: boolean) => void;
}

export const PlayerTile: React.FC<IPlayerTileProps> = (props: IPlayerTileProps): JSX.Element => {
    return (
        <div
            className={`player-tile-flex-item ${props.editMode ? "player-tile-shake" : ""} ${props.player?.getUuid() === props.selectedPlayer?.getUuid() ? "player-tile-selected" : ""}`}
            onClick={(): void => {
                props.handleTileClicked(props.player, props.editMode)
            }}>
            <div className={!!props.player ? "player-tile-name" : "player-tile-new"}>
                {!!props.player ? props.player.getName() : "+"}
            </div>
        </div>
    );
}
