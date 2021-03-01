import React from "react";
import './NextDistanceBox.scss';
import {assert} from "chai";
import {IDistancesGenerator} from "../../model/DistancesGenerator";
import {Unit} from "mathjs";

export interface INextDistanceBoxProps {
    nextDistance: Unit;
    unit: string;
}

export const NextDistanceBox: React.FC<INextDistanceBoxProps> = (props: INextDistanceBoxProps): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.unit, "!props.unit");

    return (
        <div className="next-distance box">
            <p className="next-distance-number">{!!props.nextDistance ? props.nextDistance.toNumber(props.unit) : "DONE"}</p>
            <p className="next-distance-unit"> {!!props.nextDistance ? props.unit : <span>&nbsp;</span>}</p>
        </div>);
}
