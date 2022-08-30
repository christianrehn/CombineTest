import React from 'react';
import './SelectSession.scss';
import {ISession} from "../../model/Session/Session";

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
            </div>

            <div className="sessions-flex-item">
                Hallo
            </div>
        </div>
    );
}
