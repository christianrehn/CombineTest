import React from "react";
import './DistancesGeneratorSelect.scss';
import {ITestConfiguration} from "../../model/DistancesGenerator";

export interface IDistancesGeneratorSelectProps {
    testConfigurations: ITestConfiguration[];
    selectedTestConfiguration: ITestConfiguration;
    handleTestConfigurationChanged: (selectedDistancesGenerator: ITestConfiguration) => void
}

export const DistancesGeneratorSelect: React.FC<IDistancesGeneratorSelectProps> = (props: IDistancesGeneratorSelectProps): JSX.Element => {
    return (
        <div className="distances-generators-select-container">
            <label
                className="distances-generators-select-label"
                htmlFor="distances-generators-select">Select Distances</label>
            <select
                id="distances-generators-select"
                className="distances-generators-select select-css"
                title="Select a distances generator. Changing this value will lead to a restart"
                value={props.testConfigurations.indexOf(props.selectedTestConfiguration)}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                    props.handleTestConfigurationChanged(props.testConfigurations[Number(event.target.value)]);
                }}
            >
                {
                    props.testConfigurations.map((distancesGenerator: ITestConfiguration, index: number) => {
                        return (
                            <option
                                key={`distancesGeneratorOption_${index}`}
                                value={index}
                            >
                                {distancesGenerator.description}
                            </option>
                        );
                    })
                }
            </select>
        </div>);
}
