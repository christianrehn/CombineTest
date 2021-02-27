import React from "react";
import './DistancesGeneratorSelect.scss';
import {IDistancesGenerator} from "../../model/DistancesGenerator";

export interface IDistancesGeneratorSelectProps {
    distancesGenerators: IDistancesGenerator[];
    selectedDistancesGenerator: IDistancesGenerator;
    handleDistancesGeneratorChanged: (selectedDistancesGenerator: IDistancesGenerator) => void
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
                value={props.distancesGenerators.indexOf(props.selectedDistancesGenerator)}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                    props.handleDistancesGeneratorChanged(props.distancesGenerators[Number(event.target.value)]);
                }}
            >
                {
                    props.distancesGenerators.map((distancesGenerator: IDistancesGenerator, index: number) => {
                        return (
                            <option
                                key={`distancesGeneratorOption_${index}`}
                                value={index}
                                title={distancesGenerator.getDescription()}
                            >
                                {distancesGenerator.getName()}
                            </option>
                        );
                    })
                }
            </select>
        </div>);
}
