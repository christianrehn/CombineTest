import React from 'react';
import './EditDrillConfigurationPage.scss';
import {IDrillConfiguration} from "../../model/drillconfiguration/DrillConfiguration";
import {
    DrillConfigurationSelect
} from "../../components/DrillConfiguration/DrillConfigurationSelect/DrillConfigurationSelect";
import {NumberOfShotsInput} from "../../components/DrillConfiguration/NumberOfShotsInput/NumberOfShotsInput";
import {DrillConfigurationTextInput} from "../../components/DrillConfiguration/DrillConfigurationTextInput/DrillConfigurationTextInput";
import editIcon from "../../../assets/edit.png";
import backIcon from '../../../assets/back.png';
import {SelectDrillPageName} from "../SelectDrillPage/SelectDrillPage";

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
    const [drillConfiguration, setDrillConfiguration] = React.useState<IDrillConfiguration>(props.selectedDrillConfiguration);

    return (
        <div className="edit-drill-configuration-page page">
            <div className="edit-drill-configuration-flex-item flex-item">
                <div className="page-header">
                    <h3>Edit Drill Configuration</h3>
                </div>
                <div className="NameInput">
                    <DrillConfigurationTextInput
                        label={"Name"}
                        value={drillConfiguration.name}
                        maxLength={10}
                        handleDescriptionChanged={(name: string): void =>{
                            const drillConfigurationClone: IDrillConfiguration = {...drillConfiguration};
                            drillConfigurationClone.name = name;
                            setDrillConfiguration(drillConfigurationClone);
                        }}
                    />
                </div>
                <div className="DescriptionInput">
                    <DrillConfigurationTextInput
                        label={"Description"}
                        value={drillConfiguration.description}
                        maxLength={80}
                        handleDescriptionChanged={(description: string): void =>{
                            const drillConfigurationClone: IDrillConfiguration = {...drillConfiguration};
                            drillConfigurationClone.description = description;
                            setDrillConfiguration(drillConfigurationClone);
                        }}
                    />
                </div>
                <div className="NumberOfShotsInput">
                    <NumberOfShotsInput
                        numberOfShots={drillConfiguration.numberOfShots}
                        handleNumberOfShotsChanged={(numberOfShots: number): void => {
                            const drillConfigurationClone: IDrillConfiguration = {...drillConfiguration};
                            drillConfigurationClone.numberOfShots = numberOfShots;
                            setDrillConfiguration(drillConfigurationClone);
                        }}
                    />
                </div>
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
                                  props.handleSaveDrillConfigurations(drillConfiguration);
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
