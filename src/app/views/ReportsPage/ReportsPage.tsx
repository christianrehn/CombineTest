import React from 'react';
import './ReportsPage.scss';
import backIcon from '../../../assets/back.png';

export const ReportsPageName: string = "ReportsPage";

interface IReportsPageProps {
    handleBackClicked: () => void;
}

export const ReportsPage: React.FC<IReportsPageProps> = (props: IReportsPageProps): JSX.Element => {
    console.log("ReportsPage");

    return (
        <div className="reports-page page">
            <div className="reports-top">
                <div className="reports-flex-item flex-item">
                    <div className="page-header">
                        <h3>Reports</h3>
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
        </div>
    );
}
