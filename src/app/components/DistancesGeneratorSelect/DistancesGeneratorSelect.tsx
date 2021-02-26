import React from "react";
import './DistancesGeneratorSelect.scss';
import {IDistancesGenerator} from "../../model/DistancesGenerator";

export interface IDistancesGeneratorSelectProps {
    distancesGenerators: IDistancesGenerator[];
    onChange: (selectedDistancesGenerator: IDistancesGenerator) => void
}

export const DistancesGeneratorSelect: React.FC<IDistancesGeneratorSelectProps> = (props: IDistancesGeneratorSelectProps): JSX.Element => {
    return (
        <div className="distances-generators-select-container">
            <label
                className="distances-generators-select-label"
                htmlFor="distances-generators-select">Distances Generator</label>
            <select
                id="distances-generators-select"
                className="distances-generators-select select-css"
                title="Select a distances generator. Changing this value will lead to a restart"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                    props.onChange(props.distancesGenerators[Number(event.target.value)]);
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
