import React from "react";
import './NextDistanceBox.scss';
import {assert} from "chai";
import {Unit} from "mathjs";
import {AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "../../model/AverageStrokesData";
import {IDistancesGenerator} from "../../model/DistancesGenerator";

export interface INextDistanceBoxProps {
    nextDistance: Unit;
    selectedDistancesGenerator: IDistancesGenerator;
    averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>;
}

export const NextDistanceBox: React.FC<INextDistanceBoxProps> = (props: INextDistanceBoxProps): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.selectedDistancesGenerator, "!props.selectedDistancesGenerator");

    const nextDistanceInDistancesGeneratorUnit: number =
        !!props.nextDistance
            ? props.nextDistance.toNumber(props.selectedDistancesGenerator.unit)
            : undefined;

    const averageStrokesFromNextDistance: number =
        props.averageStrokesDataMap.get(props.selectedDistancesGenerator.averageShotsGroundTypeEnum)?.computeAverageStrokesToHole(
            props.nextDistance,
        );

    return (
        <div className="next-distance box">
            <p className="next-distance-number">{!!nextDistanceInDistancesGeneratorUnit ? nextDistanceInDistancesGeneratorUnit : "DONE"}</p>
            <p className="next-distance-unit"> {!!nextDistanceInDistancesGeneratorUnit ? props.selectedDistancesGenerator.unit :
                <span>&nbsp;</span>}</p>
            <p className="next-distance-average-strokes-label">{!!averageStrokesFromNextDistance ? "Strokes to Hole" :
                <span>&nbsp;</span>}</p>
            <p className="next-distance-average-strokes">{!!averageStrokesFromNextDistance ? averageStrokesFromNextDistance.toFixed(3) :
                <span>&nbsp;</span>}</p>
        </div>);
}
