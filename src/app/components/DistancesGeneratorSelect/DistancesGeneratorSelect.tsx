import React from "react";
import './DistancesGeneratorSelect.scss';
import {ITestConfiguration} from "../../model/TestConfiguration";

export interface ITestConfigurationSelectProps {
    testConfigurations: ITestConfiguration[];
    selectedTestConfiguration: ITestConfiguration;
    handleTestConfigurationChanged: (selectedDistancesGenerator: ITestConfiguration) => void
}

export const DistancesGeneratorSelect: React.FC<ITestConfigurationSelectProps> = (props: ITestConfigurationSelectProps): JSX.Element => {
    return (
        <div className="test-configuration-select-container">
            <label
                className="test-configuration-select-label"
                htmlFor="test-configuration-select">Select Distances
            </label>
            <select
                id="test-configuration-select"
                className="test-configuration-select select-css"
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
