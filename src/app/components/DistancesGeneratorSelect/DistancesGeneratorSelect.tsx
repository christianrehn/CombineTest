import React from "react";
import './DistancesGeneratorSelect.scss';
import {IDistancesGenerator} from "../../model/DistancesGenerator";

export interface IDistancesGeneratorSelectProps {
    distancesGenerators: IDistancesGenerator[];
}

export const DistancesGeneratorSelect: React.FC<IDistancesGeneratorSelectProps> = (props: IDistancesGeneratorSelectProps): JSX.Element => {
    return (
        <div className="distances-generators-select-container">
            <select name="DistancesGenerators" id="DistancesGenerators" className="distances-generators-select">
                {
                    props.distancesGenerators.map((distancesGenerator: IDistancesGenerator) => {
                        const name: string = distancesGenerator.getName();
                        return <option value="name">{name}</option>
                    })
                }
            </select>
        </div>);
}
