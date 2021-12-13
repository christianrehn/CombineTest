import React from "react";
import './NextDistanceBox.scss';
import {assert} from "chai";
import {Unit} from "mathjs";
import {IDrillConfiguration} from "../../model/drillconfiguration/DrillConfiguration";

export interface INextDistanceBoxProps {
    nextDistance: Unit;
    selectedDrillConfiguration: IDrillConfiguration;
}

export const NextDistanceBox: React.FC<INextDistanceBoxProps> = (props: INextDistanceBoxProps): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.selectedDrillConfiguration, "!props.selectedDistancesGenerator");

    const nextDistanceInDistancesGeneratorUnit: number =
        !!props.nextDistance
            ? props.nextDistance.toNumber(props.selectedDrillConfiguration.getUnit())
            : undefined;

    const averageStrokesFromStartDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromStartDistance(props.nextDistance);

    return (
        <div className="next-distance box">
            <p className="next-distance-number">{!!nextDistanceInDistancesGeneratorUnit ? nextDistanceInDistancesGeneratorUnit :
                <span>&nbsp;</span>}</p>
            <p className="next-distance-unit"> {!!nextDistanceInDistancesGeneratorUnit ? props.selectedDrillConfiguration.getUnit() : "DONE"}</p>
            <p className="next-distance-average-strokes">{!!averageStrokesFromStartDistance ? averageStrokesFromStartDistance.toFixed(3) :
                <span>&nbsp;</span>}</p>
            <p className="next-distance-average-strokes-label">{!!averageStrokesFromStartDistance ? "Strokes" :
                <span>&nbsp;</span>}</p>
        </div>);
}
