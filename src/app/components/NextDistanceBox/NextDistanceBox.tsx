import React from "react";
import './NextDistanceBox.scss';
import {assert} from "chai";
import * as math from "mathjs";
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

    const nextDistanceInDistancesGeneratorInUnitAsNumber: number =
        !!props.nextDistance
            ? math.round(props.nextDistance.toNumber(props.selectedDrillConfiguration.getUnit()) * 10) / 10
            : undefined;

    const averageStrokesFromStartDistance: number = props.selectedDrillConfiguration.getDrillType() !== spinDrillType ? props.selectedDrillConfiguration.computeAverageStrokesFromStartDistance(props.nextDistance) : null;
    return (
        <div className="next-distance box">
            <p className="next-distance-number">{!!nextDistanceInDistancesGeneratorInUnitAsNumber ? nextDistanceInDistancesGeneratorInUnitAsNumber :
                <span>&nbsp;</span>}</p>
            <p className="next-distance-unit"> {!!nextDistanceInDistancesGeneratorInUnitAsNumber ? props.selectedDrillConfiguration.getUnit() : "DONE"}</p>
            {
                props.selectedDrillConfiguration.getDrillType() !== spinDrillType
                    ? // != spin type
                    <>
                        <p className="next-distance-average-strokes">{
                            !averageStrokesFromStartDistance
                                ? <span>&nbsp;</span>
                                : averageStrokesFromStartDistance.toFixed(3)
                        }
                        </p>
                        <p className="next-distance-average-strokes-label">{
                            !averageStrokesFromStartDistance
                                ? <span>&nbsp;</span>
                                : "Strokes"
                        }</p>
                    </>
                    :  // == spin type
                    props.selectedDrillConfiguration.getDrillType() === spinDrillType ?
                        <>
                            <p className="next-distance-target-spin-label">
                                {`Target Spin`}
                            </p>
                            <p className="next-distance-target-spin">
                                {!!nextDistanceInDistancesGeneratorInUnitAsNumber ?
                                    (props.selectedDrillConfiguration.getTargetSpinInRpmPerUnit() * nextDistanceInDistancesGeneratorInUnitAsNumber).toFixed(0)
                                    : null
                                }
                            </p>
                            <p className="next-distance-max-deviation-label">
                                {
                                    <span>Max.&nbsp;Deviation</span>}
                            </p>
                            {props.selectedDrillConfiguration.getMaxDeviationAsUnitNotPercent() ?
                                <p className="next-distance-max-deviation-percent">
                                    {(props.selectedDrillConfiguration.getMaxDeviationInUnit())}&nbsp;{props.selectedDrillConfiguration.getUnit()}
                                </p>
                                : <>
                                    <p className="next-distance-max-deviation-percent">
                                        {(props.selectedDrillConfiguration.getMaxDeviationInPercent()).toFixed(0)}&nbsp;%
                                    </p>
                                    <p className="next-distance-max-deviation-unit">
                                        {(props.selectedDrillConfiguration.getMaxDeviationInPercent() * nextDistanceInDistancesGeneratorInUnitAsNumber / 100).toFixed(1)}&nbsp;{props.selectedDrillConfiguration.getUnit()}
                                    </p>
                                </>
                            }
                        </>
                        : null
            }
        </div>);
}
