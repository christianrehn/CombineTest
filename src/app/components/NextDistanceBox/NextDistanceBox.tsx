import React from "react";
import './NextDistanceBox.scss';
import {assert} from "chai";
import {Unit} from "mathjs";
import {AverageShotsGroundTypeEnum, IAverageShots} from "../../model/AverageShots";
import {IDistancesGenerator} from "../../model/DistancesGenerator";
import {linear} from "everpolate";

export interface INextDistanceBoxProps {
    nextDistance: Unit;
    selectedDistancesGenerator: IDistancesGenerator;
    averageShotsMap: Map<AverageShotsGroundTypeEnum, IAverageShots>;
}

export const NextDistanceBox: React.FC<INextDistanceBoxProps> = (props: INextDistanceBoxProps): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.selectedDistancesGenerator, "!props.selectedDistancesGenerator");

    const averageShots: IAverageShots = props.averageShotsMap.get(props.selectedDistancesGenerator.averageShotsGroundTypeEnum)

    const nextDistanceInAverageShotsUnit: number = !!averageShots && !!props.nextDistance ? props.nextDistance.toNumber(averageShots.unit) : undefined;
    const nextDistanceInDistancesGeneratorUnit: number = !!props.nextDistance ? props.nextDistance.toNumber(props.selectedDistancesGenerator.getUnit()) : undefined;

    const averageStrokes: number[] = !!averageShots ? linear(nextDistanceInAverageShotsUnit, averageShots.distances, averageShots.strokes) : null;

    return (
        <div className="next-distance box">
            <p className="next-distance-number">{!!nextDistanceInDistancesGeneratorUnit ? nextDistanceInDistancesGeneratorUnit : "DONE"}</p>
            <p className="next-distance-unit"> {!!nextDistanceInDistancesGeneratorUnit ? props.selectedDistancesGenerator.getUnit() :
                <span>&nbsp;</span>}</p>
            <p className="next-distance-average-strokes-label">{!!averageStrokes ? "Average Strokes to Hole" :
                <span>&nbsp;</span>}</p>
            <p className="next-distance-average-strokes">{!!averageStrokes && averageStrokes.length > 0 ? averageStrokes[0].toFixed(2) :
                <span>&nbsp;</span>}</p>
        </div>);
}
