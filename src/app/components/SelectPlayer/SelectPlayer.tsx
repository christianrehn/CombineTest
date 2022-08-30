import React from 'react';
import './SelectPlayer.scss';
import {IPlayer} from "../../model/Player/Player";

interface ISelectPlayerProps {
    players: IPlayer[];
}

export const SelectPlayer: React.FC<ISelectPlayerProps> = (props: ISelectPlayerProps): JSX.Element => {
    return (
        <div className="select-player-page page">
            <div className="select-player-top">
                <div className="select-player-flex-item">
                    <div className="column-header">
                        <h3>Players</h3>
                    </div>
                </div>

                <div className="top-buttons-flex-item">

                </div>
            </div>

            <div className="players-flex-item">
                TODO
            </div>
        </div>
    );
}
