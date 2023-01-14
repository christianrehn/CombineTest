import React from 'react';
import './EditDrillConfigurationsPage.scss';
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import {assert} from "chai";
import {PageNamesType} from "../PageNamesType";
import backIcon from "../../../assets/back.png";

export const EditDrillConfigurationsPageName: PageNamesType = "EditDrillConfigurationsPage";


interface IEditDrillConfigurationsPageProps {
    allDrillConfigurations: IDrillConfiguration[];
    handleBackClicked: () => void;
    handleSaveDrillConfigurations: (allDrillConfigurations: IDrillConfiguration[]) => void;
}

export const EditDrillConfigurationsPage: React.FC<IEditDrillConfigurationsPageProps> = (props: IEditDrillConfigurationsPageProps): JSX.Element => {
    assert(!!props.allDrillConfigurations, "EditDrillConfigurationPage - !props.allDrillConfigurations");
    assert(!!props.handleBackClicked, "EditDrillConfigurationPage - !props.handleBackClicked");
    assert(!!props.handleSaveDrillConfigurations, "EditDrillConfigurationPage - !props.selectedDrillConfiguration");
    console.log("EditDrillConfigurationsPage - props.allDrillConfigurations", props.allDrillConfigurations);

    return (
        <div className="edit-drill-configurations-page page">
            <div className="edit-drill-configurations-top">
                <div className="edit-drill-configurations-flex-item flex-item">
                    <div className="page-header">
                        <h3>Edit Drill Configurations</h3>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
                    <div className={"back-flex-item flex-item"}>
                        <span className="back-span"
                              onClick={(): void => {
                                  // save changes
                                  props.handleSaveDrillConfigurations(props.allDrillConfigurations);

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

            Not yet implemented: change order, delete, disable, ...
        </div>
    );

}
