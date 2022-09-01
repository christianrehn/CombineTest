import React from 'react';
import './ReportSessionPage.scss';
import backIcon from '../../../assets/back.png';
import {ISession} from "../../model/Session/Session";
import {assert} from "chai";
import {AllShotsTable} from "../../components/AllShotsTable/AllShotsTable";

export const ReportSessionPageName: string = "ReportSessionPage";


interface EditPlayerPageProps {
    selectedSession: ISession;
    handleBackClicked: () => void;
}

export const ReportSessionPage: React.FC<EditPlayerPageProps> = (props: EditPlayerPageProps): JSX.Element => {
    assert(!!props.selectedSession, "!!props.selectedSession")

    return (
        <div className="report-session-page page">
            <div className="report-session-top">
                <div className="report-session-flex-item flex-item">
                    <div className="page-header">
                        <h3>Session "{props.selectedSession.getName()}"<br/>
                            for Drill "{props.selectedSession.getDrillConfiguration().getName()}"
                        </h3>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
                    <div className="back-flex-item flex-item">
                        <span className="back-span"
                              onClick={(): void => {
                                  // back to drill selection page
                                  props.handleBackClicked()
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={backIcon}
                                     alt="Back"
                                />
                            </div>
                        </span>
                    </div>
                </div>
            </div>

            <div className="all-shots-table">
                <AllShotsTable
                    shotDatas={props.selectedSession.getShotDatas()}
                    selectedDrillConfiguration={props.selectedSession.getDrillConfiguration()}
                />
            </div>
        </div>
    );
}
