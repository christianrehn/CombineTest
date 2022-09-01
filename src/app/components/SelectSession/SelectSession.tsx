import React from 'react';
import './SelectSession.scss';
import {ISession} from "../../model/Session/Session";
import reportsIcon from "../../../assets/reports.png";
import {SessionTile} from "../SelectSession/SessionTile/SessionTile";
import {IPlayer} from "../../model/Player/Player";
import {ReportSessionPageName} from "../../views/ReportSessionPage/ReportSessionPage";

interface ISelectSessionProps {
    selectedPlayer: IPlayer;
    sessions: ISession[];
    selectedSession: ISession;
    tileClickedHandler: (session: ISession, editMode: boolean) => void;
    handleSelectPageClicked: (page: string) => void;
}

export const SelectSession: React.FC<ISelectSessionProps> = (props: ISelectSessionProps): JSX.Element => {
    return (
        <div className="select-session-page page">
            <div className="select-session-top">
                <div className="select-session-flex-item">
                    <div className="column-header">
                        <h3>Sessions</h3>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
                    <div className="reports-flex-item flex-item">
                        <span className="reports-span"
                              onClick={(): void => {
                                  props.handleSelectPageClicked(ReportSessionPageName)
                              }}
                        >

                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={reportsIcon}
                                     alt={"Reports"}
                                />
                            </div>
                        </span>
                    </div>
                </div>
            </div>

            <div className="session-tiles-flex-item">
                { // existing sessions
                    props.sessions.filter((session: ISession): boolean => session.getPlayerUuid() === props.selectedPlayer?.getUuid())
                        .map((session: ISession, index: number) =>
                            <SessionTile
                                key={`SessionTile_${index}`}
                                session={session}
                                selectedSession={props.selectedSession}
                                handleTileClicked={props.tileClickedHandler}
                            />)
                }
            </div>
        </div>
    );
}
