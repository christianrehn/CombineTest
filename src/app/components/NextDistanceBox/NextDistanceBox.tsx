import React from "react";
import './NextDistanceBox.scss';
import {assert} from "chai";
import {Unit} from "mathjs";
import {ITestConfiguration} from "../../model/TestConfiguration";

export interface INextDistanceBoxProps {
    nextDistance: Unit;
    selectedTestConfiguration: ITestConfiguration;
}

export const NextDistanceBox: React.FC<INextDistanceBoxProps> = (props: INextDistanceBoxProps): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.selectedTestConfiguration, "!props.selectedDistancesGenerator");

    const nextDistanceInDistancesGeneratorUnit: number =
        !!props.nextDistance
            ? props.nextDistance.toNumber(props.selectedTestConfiguration.unit)
            : undefined;

    const averageStrokesFromStartDistance: number = props.selectedTestConfiguration.computeAverageStrokesFromStartDistance(props.nextDistance);

    return (
        <div className="next-distance box">
            <p className="next-distance-number">{!!nextDistanceInDistancesGeneratorUnit ? nextDistanceInDistancesGeneratorUnit :
                <span>&nbsp;</span>}</p>
            <p className="next-distance-unit"> {!!nextDistanceInDistancesGeneratorUnit ? props.selectedTestConfiguration.unit : "DONE"}</p>
            <p className="next-distance-average-strokes">{!!averageStrokesFromStartDistance ? averageStrokesFromStartDistance.toFixed(3) :
                <span>&nbsp;</span>}</p>
            <p className="next-distance-average-strokes-label">{!!averageStrokesFromStartDistance ? "Strokes" :
                <span>&nbsp;</span>}</p>
        </div>);
}
