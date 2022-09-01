import {IShotData} from "../../model/ShotData";
import React from "react";
import './AllShotsTable.scss';
import {assert} from "chai";
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import {Unit} from "mathjs";
import {computeStrokesGained} from "../../model/StrokesGained";
import {computeTrackmanScore} from "../../model/TrackmanScore";
import {
    computeAbsoluteDeviation,
    computeAverage,
    computeRelativeDeviation,
    computeStandardDeviationEntirePopulation
} from "../../util/MathUtil";
import {spinDrillType} from "../../model/SelectValues/DrillType";
import {computeSpinScore} from "../../model/SpinScore";


export interface IAllShotsTableProps {
    shotDatas: IShotData[],
    selectedDrillConfiguration: IDrillConfiguration;
}

export const AllShotsTable: React.FC<IAllShotsTableProps> = (props: IAllShotsTableProps): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.shotDatas, "!props.shotDatas");
    assert(!!props.selectedDrillConfiguration, "AllShotsTable - !props.selectedDrillConfiguration");
    console.log("props.shotDatas", props.shotDatas)
    console.log("props.selectedDrillConfiguration", props.selectedDrillConfiguration)

    const empty: JSX.Element = <span>&nbsp;</span>;
    let strokesGainedValues: number[] = [];
    let trackmanScoreValues: number[] = [];
    let spinScoreValues: number[] = [];
    let targetDistanceInUnitAsNumberValues: number[] = [];
    let carryValues: number[] = [];
    let totalDistanceInUnitAsNumberValues: number[] = [];
    let offlineInUnitAsNumberValues: number[] = [];
    let absoluteDeviationInUnitAsNumberValues: number[] = [];
    let relativeDeviationValues: number[] = [];
    let targetSpinInRpmValues: number[] = [];
    let totalSpinInRpmValues: number[] = [];
    return (
        <div className="all-shots-component">
            <table className="table-with-shots">
                <tbody>
                <tr className="parameter-names-row">
                    <td>Shot</td>
                    {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                        <td>Gained</td>}
                    {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                        <td>Score</td>}
                    {props.selectedDrillConfiguration.getDrillType() !== spinDrillType ? null :
                        <td>Spin Score</td>}
                    <td>Target</td>
                    <td>Carry</td>
                    <td>Total</td>
                    <td>Offline</td>
                    {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                        <>
                            <td>Abs. Dev.</td>
                            <td>Rel. Dev.</td>
                        </>
                    }
                    {props.selectedDrillConfiguration.getDrillType() !== spinDrillType ? null :
                        <>
                            <td>Target Spin</td>
                            <td>Total Spin</td>
                        </>
                    }
                </tr>
                <tr className="parameter-units-row">
                    <td>{empty}</td>
                    {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                        <td>Strokes</td>}
                    {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                        <td>{empty}</td>}
                    {props.selectedDrillConfiguration.getDrillType() !== spinDrillType ? null :
                        <td>{empty}</td>}
                    <td>{props.selectedDrillConfiguration.getUnit()}</td>
                    <td>{props.selectedDrillConfiguration.getUnit()}</td>
                    <td>{props.selectedDrillConfiguration.getUnit()}</td>
                    <td>{props.selectedDrillConfiguration.getUnit()}</td>
                    {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                        <>
                            <td>{props.selectedDrillConfiguration.getUnit()}</td>
                            <td>%</td>
                        </>
                    }
                    {props.selectedDrillConfiguration.getDrillType() !== spinDrillType ? null :
                        <>
                            <td>rpm</td>
                            <td>rpm</td>
                        </>
                    }
                </tr>
                {
                    props.shotDatas.map((shotData: IShotData, index: number): JSX.Element => {
                        // compute strokes gained
                        const averageStrokesFromStartDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromStartDistance(shotData.targetDistance);
                        const absoluteDeviation: Unit = computeAbsoluteDeviation(shotData);
                        const averageStrokesFromEndDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromEndDistance(absoluteDeviation);

                        const strokesGained: number = computeStrokesGained(averageStrokesFromStartDistance, averageStrokesFromEndDistance);
                        strokesGainedValues.push(strokesGained);

                        const trackmanScore: number = computeTrackmanScore(shotData.targetDistance, absoluteDeviation);
                        trackmanScoreValues.push(trackmanScore);

                        const spinScore: number = computeSpinScore(props.selectedDrillConfiguration, shotData.targetDistance, shotData.totalSpin, shotData.carry);
                        spinScoreValues.push(spinScore);

                        const targetDistanceInUnitAsNumber: number = shotData.targetDistance.toNumber(props.selectedDrillConfiguration.getUnit());
                        targetDistanceInUnitAsNumberValues.push(targetDistanceInUnitAsNumber);

                        const carry: number = shotData.carry.toNumber(props.selectedDrillConfiguration.getUnit());
                        carryValues.push(carry);

                        const totalDistanceInUnitAsNumber: number = shotData.totalDistance.toNumber(props.selectedDrillConfiguration.getUnit());
                        totalDistanceInUnitAsNumberValues.push(totalDistanceInUnitAsNumber);

                        const offlineInUnitAsNumber: number = shotData.offline.toNumber(props.selectedDrillConfiguration.getUnit());
                        offlineInUnitAsNumberValues.push(offlineInUnitAsNumber);

                        const absoluteDeviationInUnitAsNumber: number = computeAbsoluteDeviation(shotData).toNumber(props.selectedDrillConfiguration.getUnit());
                        absoluteDeviationInUnitAsNumberValues.push(absoluteDeviationInUnitAsNumber);

                        const relativeDeviation: number = (computeRelativeDeviation(shotData) * 100);
                        relativeDeviationValues.push(relativeDeviation);

                        const targetSpinInRpm: number = props.selectedDrillConfiguration.getTargetSpinInRpmPerUnit() * targetDistanceInUnitAsNumber;
                        targetSpinInRpmValues.push(targetSpinInRpm);

                        const totalSpinInRpm: number = shotData.totalSpin;
                        totalSpinInRpmValues.push(totalSpinInRpm);


                        return <tr
                            className={`row-with-shot-details ${props.selectedDrillConfiguration.getDrillType() === spinDrillType ? "row-with-shot-details-spin" : "row-with-shot-details-no-spin"}`}
                            key={`row-with-shot-details_${index}`}>
                            <td>{(index + 1).toString(10)}</td>
                            {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                                <td>{strokesGained.toFixed(3)}</td>}
                            {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                                <td>{trackmanScore.toFixed(1)}</td>}
                            {props.selectedDrillConfiguration.getDrillType() !== spinDrillType ? null :
                                <td>{spinScore.toFixed(1)}</td>}
                            <td>{targetDistanceInUnitAsNumber.toFixed(2)}</td>
                            <td>{carry.toFixed(2)}</td>
                            <td>{totalDistanceInUnitAsNumber.toFixed(2)}</td>
                            <td>{offlineInUnitAsNumber.toFixed(2)}</td>
                            {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                                <>
                                    <td>{absoluteDeviationInUnitAsNumber.toFixed(2)}</td>
                                    <td>{relativeDeviation.toFixed(1)}</td>
                                </>
                            }
                            {props.selectedDrillConfiguration.getDrillType() !== spinDrillType ? null :
                                <>
                                    <td>{targetSpinInRpm.toFixed(0)}</td>
                                    <td>{totalSpinInRpm.toFixed(0)}</td>
                                </>
                            }
                        </tr>;
                    })
                }

                <tr className={`average-values-row bottom-values-row ${props.selectedDrillConfiguration.getDrillType() === spinDrillType ? "average-values-row-spin bottom-values-row-spin" : "average-values-row-no-spin bottom-values-row-no-spin"}`}>
                    <td>Average</td>
                    {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                        <td>{props.shotDatas.length > 0 ? computeAverage(strokesGainedValues).toFixed(3) : ""}</td>}
                    {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                        <td>{props.shotDatas.length > 0 ? computeAverage(trackmanScoreValues).toFixed(1) : ""}</td>}
                    {props.selectedDrillConfiguration.getDrillType() !== spinDrillType ? null :
                        <td>{props.shotDatas.length > 0 ? computeAverage(spinScoreValues).toFixed(1) : ""}</td>}
                    <td>{props.shotDatas.length > 0 ? computeAverage(targetDistanceInUnitAsNumberValues).toFixed(2) : ""}</td>
                    <td>{props.shotDatas.length > 0 ? computeAverage(carryValues).toFixed(2) : ""}</td>
                    <td>{props.shotDatas.length > 0 ? computeAverage(totalDistanceInUnitAsNumberValues).toFixed(2) : ""}</td>
                    <td>{props.shotDatas.length > 0 ? computeAverage(offlineInUnitAsNumberValues).toFixed(2) : ""}</td>
                    {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                        <>
                            <td>{props.shotDatas.length > 0 ? computeAverage(absoluteDeviationInUnitAsNumberValues).toFixed(2) : ""}</td>
                            <td>{props.shotDatas.length > 0 ? computeAverage(relativeDeviationValues).toFixed(1) : ""}</td>
                        </>
                    }
                    {props.selectedDrillConfiguration.getDrillType() !== spinDrillType ? null :
                        <>
                            <td>{props.shotDatas.length > 0 ? computeAverage(targetSpinInRpmValues).toFixed(0) : ""}</td>
                            <td>{props.shotDatas.length > 0 ? computeAverage(totalSpinInRpmValues).toFixed(0) : ""}</td>
                        </>
                    }
                </tr>
                <tr className={`consistency-values-row bottom-values-row ${props.selectedDrillConfiguration.getDrillType() === spinDrillType ? "bottom-values-row-spin" : "bottom-values-row-no-spin"}`}>
                    <td>Consistency</td>
                    {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                        <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(strokesGainedValues).toFixed(3) : ""}</td>}
                    {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                        <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(trackmanScoreValues).toFixed(1) : ""}</td>}
                    {props.selectedDrillConfiguration.getDrillType() !== spinDrillType ? null :
                        <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(spinScoreValues).toFixed(1) : ""}</td>}
                    <td></td>
                    <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(carryValues).toFixed(2) : ""}</td>
                    <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(totalDistanceInUnitAsNumberValues).toFixed(2) : ""}</td>
                    <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(offlineInUnitAsNumberValues).toFixed(2) : ""}</td>
                    {props.selectedDrillConfiguration.getDrillType() === spinDrillType ? null :
                        <>
                            <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(absoluteDeviationInUnitAsNumberValues).toFixed(2) : ""}</td>
                            <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(relativeDeviationValues).toFixed(1) : ""}</td>
                        </>
                    }
                    {props.selectedDrillConfiguration.getDrillType() !== spinDrillType ? null :
                        <>
                            <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(targetSpinInRpmValues).toFixed(0) : ""}</td>
                            <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(totalSpinInRpmValues).toFixed(0) : ""}</td>
                        </>
                    }
                </tr>
                </tbody>
            </table>
        </div>
    );
}
