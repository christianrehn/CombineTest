import React from "react";
import './SessionTile.scss';
import {ISession} from "../../../model/Session/Session";

export interface ISessionTileProps {
    session: ISession;
    selectedSession: ISession;
    handleTileClicked: (session: ISession, editMode: boolean) => void;
}

export const SessionTile: React.FC<ISessionTileProps> = (props: ISessionTileProps): JSX.Element => {
    return (
        <div
            className={`session-tile-flex-item ${props.session?.getUuid() === props.selectedSession?.getUuid() ? "session-tile-selected" : ""}`}
            onClick={(): void => {
                props.handleTileClicked(props.session, false)
            }}>
            <div className={!!props.session ? "session-tile-name" : "session-tile-new"}>
                {!!props.session ? <div>
                    {props.session.getName()}<br/>
                    {props.session.getDrillConfiguration()?.getName() ?? "unknown drill configuration"}
                </div> : "+"}
            </div>
        </div>
    );
}
