import React from 'react';
import './EditDrillConfigurationPage.scss';
import shotsIcon from "../../../assets/golfer.png";
import {IDrillConfiguration} from "../../model/DrillConfiguration";
import {
    DrillConfigurationSelect
} from "../../components/DrillConfiguration/DrillConfigurationSelect/DrillConfigurationSelect";
import {NumberOfShotsInput} from "../../components/DrillConfiguration/NumberOfShotsInput/NumberOfShotsInput";
import {DescriptionInput} from "../../components/DrillConfiguration/DescriptionInput/DescriptionInput";

export const EditDrillConfigurationPageName: string = "EditDrillConfigurationPage";

interface IEditDrillConfigurationPageProps {
    drillConfigurations: IDrillConfiguration[];
    handleDrillConfigurationsChanged: (drillConfigurations: IDrillConfiguration[]) => void;
    selectedDrillConfiguration: IDrillConfiguration;
    handleSelectedDrillConfigurationChanged: (drillConfiguration: IDrillConfiguration) => void;
    handleSelectPageClicked: (page: string) => void;
}

export const EditDrillConfigurationPage: React.FC<IEditDrillConfigurationPageProps> = (props: IEditDrillConfigurationPageProps): JSX.Element => {
    const [drillConfiguration, setDrillConfiguration] = React.useState<IDrillConfiguration>(props.selectedDrillConfiguration);

    return (
        <div className="edit-drill-configuration-page page">
            <div className="edit-drill-configuration-flex-item flex-item">
                <div className="page-header">
                    <h3>Settings</h3>
                </div>
                <div className="DistancesGeneratorSelect">
                    <DrillConfigurationSelect
                        drillConfigurations={props.drillConfigurations}
                        selectedDrillConfiguration={drillConfiguration}
                        handleSelectedDrillConfigurationChanged={props.handleSelectedDrillConfigurationChanged}
                    />
                </div>
                <div className="DescriptionInput">
                    <DescriptionInput
                        description={drillConfiguration.description}
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
                        handleNumberOfShotsChanged={(numberOfShots: number): void =>{
                            const drillConfigurationClone: IDrillConfiguration = {...drillConfiguration};
                            drillConfigurationClone.numberOfShots = numberOfShots;
                            setDrillConfiguration(drillConfigurationClone);
                        }}
                    />
                </div>
            </div>

            <div className="page-change-flex-item flex-item">
                <span className="page-change-span"
                      onClick={(): void => {
                          console.log(props.handleSelectPageClicked)
                      }}
                >
                    <img className="page-change-img"
                         src={shotsIcon}
                         alt="Settings"
                    />
                </span>
            </div>
        </div>
    );
}
