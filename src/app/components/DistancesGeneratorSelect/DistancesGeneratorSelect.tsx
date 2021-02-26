import React from "react";
import './DistancesGeneratorSelect.scss';

export interface IDistancesGeneratorSelectProps {
}

export const DistancesGeneratorSelect: React.FC<IDistancesGeneratorSelectProps> = (props: IDistancesGeneratorSelectProps): JSX.Element => {
    return (<select name="DistancesGenerators" id="DistancesGenerators">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
    </select>);
}
