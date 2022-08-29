import React from "react";
import './NextDistanceBox.scss';
import {assert} from "chai";
import {Unit} from "mathjs";
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import {spinDrillType} from "../../model/SelectValues/DrillType";

export interface INextDistanceBoxProps {
    nextDistance: Unit;
    selectedDrillConfiguration: IDrillConfiguration;
}

export const NextDistanceBox: React.FC<INextDistanceBoxProps> = (props: INextDistanceBoxProps): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.selectedDrillConfiguration, "NextDistanceBox - !props.selectedDistancesGenerator");

    const nextDistanceInDistancesGeneratorUnit: number =
        !!props.nextDistance
            ? props.nextDistance.toNumber(props.selectedDrillConfiguration.getUnit())
            : undefined;

    const averageStrokesFromStartDistance: number = props.selectedDrillConfiguration.getDrillType() !== spinDrillType ? props.selectedDrillConfiguration.computeAverageStrokesFromStartDistance(props.nextDistance) : null;
    return (
        <div className="next-distance box">
            <p className="next-distance-number">{!!nextDistanceInDistancesGeneratorUnit ? nextDistanceInDistancesGeneratorUnit :
                <span>&nbsp;</span>}</p>
            <p className="next-distance-unit"> {!!nextDistanceInDistancesGeneratorUnit ? props.selectedDrillConfiguration.getUnit() : "DONE"}</p>
            <p className="next-distance-average-strokes">{
                props.selectedDrillConfiguration.getDrillType() === spinDrillType
                    ?
                    <span>Max&nbsp;Dev {(props.selectedDrillConfiguration.getDeviationInUnit()).toFixed(1)}&nbsp;{props.selectedDrillConfiguration.getUnit()}</span>
                    : !averageStrokesFromStartDistance
                        ? <span>&nbsp;</span>
                        : averageStrokesFromStartDistance.toFixed(3)
            }
            </p>
            <p className="next-distance-average-strokes-label">{
                props.selectedDrillConfiguration.getDrillType() === spinDrillType
                    ? `Setpoint ${(props.selectedDrillConfiguration.getTargetRpmPerUnit() * nextDistanceInDistancesGeneratorUnit).toFixed(0)} RPM`
                    : !averageStrokesFromStartDistance
                        ? <span>&nbsp;</span>
                        : "Strokes"
            }</p>
        </div>);
}
