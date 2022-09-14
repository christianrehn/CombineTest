import React from "react";
import './NextDistanceBox.scss';
import {assert} from "chai";
import * as math from "mathjs";
import {Unit} from "mathjs";
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import {
    spinDrillType,
    targetCircleDrillType,
    trackmanScoreAndShotsGainedDrillType
} from "../../model/SelectValues/DrillType";

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

    const averageStrokesFromStartDistance: number = [trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
        ? props.selectedDrillConfiguration.computeAverageStrokesFromStartDistance(props.nextDistance)
        : null;
    return (
        <div className="next-distance box">
            <p className="next-distance-number">{!!nextDistanceInDistancesGeneratorInUnitAsNumber ? nextDistanceInDistancesGeneratorInUnitAsNumber :
                <span>&nbsp;</span>}</p>
            <p className="next-distance-unit"> {!!nextDistanceInDistancesGeneratorInUnitAsNumber ? props.selectedDrillConfiguration.getUnit() : "DONE"}</p>
            {
                [trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                    ? <>
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
                        }
                        </p>
                    </>
                    : [spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <>
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
                                <p className="next-distance-max-deviation-in-unit">
                                    {(props.selectedDrillConfiguration.getMaxDeviationInUnit())}&nbsp;{props.selectedDrillConfiguration.getUnit()}
                                </p>
                                : <>
                                    <p className="next-distance-max-deviation-in-percent">
                                        {(props.selectedDrillConfiguration.getMaxDeviationInPercent()).toFixed(0)}&nbsp;%
                                    </p>
                                    <p className="next-distance-max-deviation-in-unit">
                                        {(props.selectedDrillConfiguration.getMaxDeviationInPercent() * nextDistanceInDistancesGeneratorInUnitAsNumber / 100).toFixed(1)}&nbsp;{props.selectedDrillConfiguration.getUnit()}
                                    </p>
                                </>
                            }
                        </>
                        : [targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                            ? <>
                                <p className="next-distance-target-circle-radius-label">
                                    {`Target Circle Radius`}
                                </p>
                                {props.selectedDrillConfiguration.getTargetCircleRadiusAsUnitNotPercent() ?
                                    <p className="next-distance-target-circle-radius-in-unit">
                                        {(props.selectedDrillConfiguration.getTargetCircleRadiusInUnit())}&nbsp;{props.selectedDrillConfiguration.getUnit()}
                                    </p>
                                    : <>
                                        <p className="next-distance-target-circle-radius-in-percent">
                                            {(props.selectedDrillConfiguration.getTargetCircleRadiusInPercent()).toFixed(0)}&nbsp;%
                                        </p>
                                        <p className="next-distance-target-circle-radius-in-unit">
                                            {(props.selectedDrillConfiguration.getTargetCircleRadiusInPercent() * nextDistanceInDistancesGeneratorInUnitAsNumber / 100).toFixed(1)}&nbsp;{props.selectedDrillConfiguration.getUnit()}
                                        </p>
                                    </>
                                }
                            </>
                            : assert.fail(`drill type unknown: ${props.selectedDrillConfiguration.getDrillType()}`)
            }
        </div>);
}
