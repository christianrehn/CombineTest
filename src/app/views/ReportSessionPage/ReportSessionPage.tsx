import React from 'react';
import './ReportSessionPage.scss';
import backIcon from '../../../assets/back.png';
import {ISession} from "../../model/Session/Session";
import {assert} from "chai";
import {AllShotsTable} from "../../components/AllShotsTable/AllShotsTable";
import {ShotsSvg} from "../../components/ShotsSvg/ShotsSvg";
import {PageNamesType} from "../PageNamesType";

export const ReportSessionPageName: PageNamesType = "ReportSessionPage";


interface ReportSessionPageProps {
    selectedSession: ISession;
    handleBackClicked: () => void;
}


export const ReportSessionPage: React.FC<ReportSessionPageProps> = (props: ReportSessionPageProps): JSX.Element => {
    assert(!!props.selectedSession, "!!props.selectedSession")

    const allShotsTabName: string = "allShotsTab";
    const dispersionTabName: string = "dispersionTab";
    const [activeTab, setActiveTab] = React.useState(allShotsTabName);

    const allShotsTab = (): JSX.Element => {
        return (
            activeTab === allShotsTabName
                ? <div className="all-shots-tab">
                    <div className="all-shots-table-flex-item flex-item">
                        <div className="all-shots-table">
                            <AllShotsTable
                                shotDatas={props.selectedSession.getShotDatas()}
                                selectedDrillConfiguration={props.selectedSession.getDrillConfiguration()}
                            />
                        </div>
                    </div>
                </div>
                : null
        );
    }

    const dispersionTab = (): JSX.Element => {
        return (
            activeTab === dispersionTabName
                ? <div className="shots-svg flex-item">
                    <div className="page-header">
                        <h3>Dispersion</h3>
                    </div>
                    <div className="t">
                        <div className="ShotsSvg">
                            <ShotsSvg
                                shotDatas={props.selectedSession.getShotDatas()}
                                selectedDrillConfiguration={props.selectedSession.getDrillConfiguration()}
                                nextDistance={undefined}
                            />
                        </div>
                    </div>
                </div>
                : null
        );
    }

    return (
        <div className="report-session-page page">
            <div className="report-session-top">
                <div className="report-session-flex-item flex-item">
                    <div className="page-header">
                        <h3>Session "{props.selectedSession.getName()}"<br/>
                            for Drill
                            "{props.selectedSession.getDrillConfiguration()?.getName() ?? "unknown drill configuration"}"
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

            <div className="shot-tabs">
                {/* Tab content */}
                {allShotsTab()}
                {dispersionTab()}

                {/* Tab links */}
                <div className="tab-links">
                    <button
                        className={`tab-link-button ${activeTab === allShotsTabName ? "tab-link-button-active" : ""}`}
                        onClick={() => setActiveTab(allShotsTabName)}
                    >
                        All Shots in Session
                    </button>
                    <button
                        className={`tab-link-button ${activeTab === dispersionTabName ? "tab-link-button-active" : ""}`}
                        onClick={() => setActiveTab(dispersionTabName)}
                    >
                        Dispersion
                    </button>
                </div>
            </div>
        </div>
    );
}
