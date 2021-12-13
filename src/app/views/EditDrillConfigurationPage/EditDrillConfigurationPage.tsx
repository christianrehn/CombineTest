import React from 'react';
import './EditDrillConfigurationPage.scss';
import {IDrillConfiguration} from "../../model/drillconfiguration/DrillConfiguration";
import {
    DrillConfigurationTextInput
} from "../../components/DrillConfiguration/DrillConfigurationTextInput/DrillConfigurationTextInput";
import editIcon from "../../../assets/edit.png";
import backIcon from '../../../assets/back.png';
import {SelectDrillPageName} from "../SelectDrillPage/SelectDrillPage";
import {
    DrillConfigurationSelect
} from "../../components/DrillConfiguration/DrillConfigurationSelect/DrillConfigurationSelect";
import {lengthUnits} from "../../model/unit/Unit";
import {assert} from "chai";

export const EditDrillConfigurationPageName: string = "EditDrillConfigurationPage";

interface IEditDrillConfigurationPageProps {
    drillConfigurations: IDrillConfiguration[];
    handleDrillConfigurationsChanged: (drillConfigurations: IDrillConfiguration[]) => void;
    selectedDrillConfiguration: IDrillConfiguration;
    handleSelectedDrillConfigurationChanged: (drillConfiguration: IDrillConfiguration) => void;
    handleSelectPageClicked: (page: string) => void;
    handleSaveDrillConfigurations: (changedDrillConfiguration: IDrillConfiguration) => void;
}

export const EditDrillConfigurationPage: React.FC<IEditDrillConfigurationPageProps> = (props: IEditDrillConfigurationPageProps): JSX.Element => {
    assert(!!props.selectedDrillConfiguration, "!props.selectedDrillConfiguration");

    console.log("EditDrillConfigurationPage - props.selectedDrillConfiguration", props.selectedDrillConfiguration);

    return (
        <div className="edit-drill-configuration-page page">
            <div className="edit-drill-configuration-flex-item flex-item">
                <div className="page-header">
                    <h3>Edit Drill Configuration</h3>
                </div>
                <div className="NameInput">
                    <DrillConfigurationTextInput
                        label={"Name"}
                        value={props.selectedDrillConfiguration.getName()}
                        maxLength={10}
                        handleOnChange={(value: string): void => {
                            const drillConfigurationClone: IDrillConfiguration = {...props.selectedDrillConfiguration};
                            drillConfigurationClone.setName(value);
                            props.handleSelectedDrillConfigurationChanged(drillConfigurationClone);
                        }}
                    />
                </div>
                <div className="DescriptionInput">
                    <DrillConfigurationTextInput
                        label={"Description"}
                        value={props.selectedDrillConfiguration.getDescription()}
                        maxLength={80}
                        handleOnChange={(value: string): void => {
                            const drillConfigurationClone: IDrillConfiguration = {...props.selectedDrillConfiguration};
                            drillConfigurationClone.setDescription(value);
                            props.handleSelectedDrillConfigurationChanged(drillConfigurationClone);
                        }}
                    />
                </div>
                <div className="UnitInput">
                    <DrillConfigurationSelect
                        label={"Unit"}
                        index={lengthUnits.indexOf(props.selectedDrillConfiguration.getUnit())}
                        values={lengthUnits}
                        handleOnChange={(index: number): void => {
                            if (index >= 0) {
                                console.log("index", index)
                                console.log("lengthUnits[index]", lengthUnits[index])
                                const drillConfigurationClone: IDrillConfiguration = {...props.selectedDrillConfiguration};
                                console.log("calling set unit")
                                drillConfigurationClone.setUnit(lengthUnits[index]);
                                console.log("drillConfigurationClone", drillConfigurationClone)
                                props.handleSelectedDrillConfigurationChanged(drillConfigurationClone);
                            }
                        }}
                    />
                </div>
                {/*<div className="NumberOfShotsInput">*/}
                {/*    <NumberOfShotsInput*/}
                {/*        numberOfShots={drillConfiguration.numberOfShots}*/}
                {/*        handleNumberOfShotsChanged={(numberOfShots: number): void => {*/}
                {/*            const drillConfigurationClone: IDrillConfiguration = {...drillConfiguration};*/}
                {/*            drillConfigurationClone.numberOfShots = numberOfShots;*/}
                {/*            setDrillConfiguration(drillConfigurationClone);*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</div>*/}
            </div>

            <div className="top-buttons-flex-item">
                <div className="edit-flex-item flex-item">
                        <span className="edit-span"
                              onClick={(): void => {
                                  console.log("TODO")
                              }}
                        >

                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={editIcon}
                                     alt="Edit"
                                />
                            </div>
                        </span>
                </div>
                <div className="back-flex-item flex-item">
                        <span className="back-span"
                              onClick={(): void => {
                                  props.handleSaveDrillConfigurations(props.selectedDrillConfiguration);
                                  props.handleSelectPageClicked(SelectDrillPageName)
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
    );
}
