import React from 'react';
import './SelectSession.scss';
import {ISession} from "../../model/Session/Session";
import reportsIcon from "../../../assets/reports.png";

interface ISelectSessionProps {
    sessions: ISession[];
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
                                  // props.handleSelectPageClicked(ReportsPageName)
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

            <div className="sessions-flex-item">
                Hallo
            </div>
        </div>
    );
}
