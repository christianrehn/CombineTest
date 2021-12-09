import React from "react";
import './DrillConfigurationSelect.scss';
import {IDrillConfiguration} from "../../../model/DrillConfiguration";

export interface ITestConfigurationSelectProps {
    drillConfigurations: IDrillConfiguration[];
    selectedDrillConfiguration: IDrillConfiguration;
    handleSelectedDrillConfigurationChanged: (selectedDistancesGenerator: IDrillConfiguration) => void
}

export const DrillConfigurationSelect: React.FC<ITestConfigurationSelectProps> = (props: ITestConfigurationSelectProps): JSX.Element => {
    return (
        <div className="drill-configuration-select-container">
            <label
                className="drill-configuration-select-label"
                htmlFor="drill-configuration-select">Select Distances
            </label>
            <select
                id="drill-configuration-select"
                className="drill-configuration-select select-css"
                title="Select a distances generator. Changing this value will lead to a restart"
                value={props.drillConfigurations.indexOf(props.selectedDrillConfiguration)}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                    props.handleSelectedDrillConfigurationChanged(props.drillConfigurations[Number(event.target.value)]);
                }}
            >
                {
                    props.drillConfigurations.map((drillConfiguration: IDrillConfiguration, index: number) => {
                        return (
                            <option
                                key={`drillConfigurationOption_${index}`}
                                value={index}
                            >
                                {drillConfiguration.description}
                            </option>
                        );
                    })
                }
            </select>
        </div>);
}
