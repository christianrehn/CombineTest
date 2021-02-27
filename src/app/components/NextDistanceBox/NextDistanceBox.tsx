import React from "react";
import './NextDistanceBox.scss';
import {IDistancesGenerator} from "../../model/DistancesGenerator";

export interface INextDistanceBoxProps {
    nextDistance: number;
    selectedDistancesGenerator: IDistancesGenerator;
}

export const NextDistanceBox: React.FC<INextDistanceBoxProps> = (props: INextDistanceBoxProps): JSX.Element => {
    return (
        <div className="next-distance box">
            <p className="next-distance-number">{!!props.nextDistance ? props.nextDistance : "DONE"}</p>
            <p className="next-distance-unit"> {!!props.nextDistance ? "Meter" : <span>&nbsp;</span>}</p>
        </div>);
}
