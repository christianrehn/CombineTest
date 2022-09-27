import {IShotData} from "../../model/ShotData/ShotData";
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
    computeNumberOfShotsToDrop,
    computeRelativeDeviation,
    computeStandardDeviationEntirePopulation
} from "../../util/MathUtil";
import {
    spinDrillType,
    targetCircleDrillType,
    trackmanScoreAndShotsGainedDrillType
} from "../../model/SelectValues/DrillType";
import {computeSpinScore} from "../../model/SpinScore";
import {computeTargetCircleScore} from "../../model/TargetCircleScore";


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
    let targerCircleScoreValues: number[] = [];
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
                    {[trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <>
                            <td>Gained</td>
                            <td>Score</td>
                        </>
                        : null}
                    {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <td>Spin Score</td>
                        : null}
                    {[targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <td>TC Score</td>
                        : null}
                    <td>Target</td>
                    <td>Carry</td>
                    <td>Total</td>
                    <td>Offline</td>
                    {[trackmanScoreAndShotsGainedDrillType, targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <>
                            <td>Abs. Dev.</td>
                            <td>Rel. Dev.</td>
                        </>
                        : null
                    }
                    {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <>
                            <td>Target Spin</td>
                            <td>Total Spin</td>
                        </>
                        : null
                    }
                </tr>
                <tr className="parameter-units-row">
                    <td>{empty}</td>
                    {[trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <>
                            <td>Strokes</td>
                            <td>{empty}</td>
                        </>
                        : null}
                    {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <td>{empty}</td>
                        : null}
                    {[targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <td>{empty}</td>
                        : null}
                    <td>{props.selectedDrillConfiguration.getUnit()}</td>
                    <td>{props.selectedDrillConfiguration.getUnit()}</td>
                    <td>{props.selectedDrillConfiguration.getUnit()}</td>
                    <td>{props.selectedDrillConfiguration.getUnit()}</td>
                    {[trackmanScoreAndShotsGainedDrillType, targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <>
                            <td>{props.selectedDrillConfiguration.getUnit()}</td>
                            <td>%</td>
                        </>
                        : null}
                    {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <>
                            <td>rpm</td>
                            <td>rpm</td>
                        </>
                        : null
                    }
                </tr>
                {
                    props.shotDatas.map((shotData: IShotData, index: number): JSX.Element => {
                        // compute strokes gained
                        const averageStrokesFromStartDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromStartDistance(shotData.getTargetDistance());
                        const absoluteDeviation: Unit = computeAbsoluteDeviation(shotData);
                        const averageStrokesFromEndDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromEndDistance(absoluteDeviation);

                        const strokesGained: number = computeStrokesGained(averageStrokesFromStartDistance, averageStrokesFromEndDistance);
                        strokesGainedValues.push(strokesGained);

                        const trackmanScore: number = computeTrackmanScore(shotData.getTargetDistance(), absoluteDeviation);
                        trackmanScoreValues.push(trackmanScore);

                        const spinScore: number = computeSpinScore(props.selectedDrillConfiguration, shotData.getTargetDistance(), shotData.getTotalSpin(), shotData.getCarry());
                        spinScoreValues.push(spinScore);

                        const targerCircleScore: number = computeTargetCircleScore(props.selectedDrillConfiguration, shotData.getTargetDistance(), absoluteDeviation);
                        targerCircleScoreValues.push(targerCircleScore);

                        const targetDistanceInUnitAsNumber: number = shotData.getTargetDistance().toNumber(props.selectedDrillConfiguration.getUnit());
                        targetDistanceInUnitAsNumberValues.push(targetDistanceInUnitAsNumber);

                        const carry: number = shotData.getCarry().toNumber(props.selectedDrillConfiguration.getUnit());
                        carryValues.push(carry);

                        const totalDistanceInUnitAsNumber: number = shotData.getTotalDistance().toNumber(props.selectedDrillConfiguration.getUnit());
                        totalDistanceInUnitAsNumberValues.push(totalDistanceInUnitAsNumber);

                        const offlineInUnitAsNumber: number = shotData.getOffline().toNumber(props.selectedDrillConfiguration.getUnit());
                        offlineInUnitAsNumberValues.push(offlineInUnitAsNumber);

                        const absoluteDeviationInUnitAsNumber: number = computeAbsoluteDeviation(shotData).toNumber(props.selectedDrillConfiguration.getUnit());
                        absoluteDeviationInUnitAsNumberValues.push(absoluteDeviationInUnitAsNumber);

                        const relativeDeviation: number = (computeRelativeDeviation(shotData) * 100);
                        relativeDeviationValues.push(relativeDeviation);

                        const targetSpinInRpm: number = props.selectedDrillConfiguration.getTargetSpinInRpmPerUnit() * targetDistanceInUnitAsNumber;
                        targetSpinInRpmValues.push(targetSpinInRpm);

                        const totalSpinInRpm: number = shotData.getTotalSpin();
                        totalSpinInRpmValues.push(totalSpinInRpm);


                        return <tr
                            className={`row-with-shot-details ${
                                [trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                                    ? "row-with-shot-details-trackman-score-and-shots-gained"
                                    : [spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                                        ? "row-with-shot-details-spin"
                                        : [targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                                            ? "row-with-shot-details-target-circle"
                                            : assert.fail(`drill type unknown: ${props.selectedDrillConfiguration.getDrillType()}`)
                            }`
                            }
                            key={`row-with-shot-details_${index}`}>
                            <td>{(index + 1).toString(10)}</td>
                            {[trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                                ? <>
                                    <td>{strokesGained.toFixed(3)}</td>
                                    <td>{trackmanScore.toFixed(1)}</td>
                                </>
                                : null}
                            {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                                ? <td>{spinScore.toFixed(1)}</td>
                                : null}
                            {[targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                                ? <td>{targerCircleScore.toFixed(1)}</td>
                                : null}
                            <td>{targetDistanceInUnitAsNumber.toFixed(2)}</td>
                            <td>{carry.toFixed(2)}</td>
                            <td>{totalDistanceInUnitAsNumber.toFixed(2)}</td>
                            <td>{offlineInUnitAsNumber.toFixed(2)}</td>
                            {[trackmanScoreAndShotsGainedDrillType, targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                                ? <>
                                    <td>{absoluteDeviationInUnitAsNumber.toFixed(2)}</td>
                                    <td>{relativeDeviation.toFixed(1)}</td>
                                </>
                                : null}
                            {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                                ? <>
                                    <td>{targetSpinInRpm.toFixed(0)}</td>
                                    <td>{totalSpinInRpm.toFixed(0)}</td>
                                </>
                                : null}
                        </tr>;
                    })
                }

                <tr className={`average-values-row bottom-values-row ${
                    [trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? "average-values-row-trackman-score-and-shots-gained bottom-values-row-trackman-score-and-shots-gained"
                        : [spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                            ? "average-values-row-spin bottom-values-row-spin"
                            : [targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                                ? "average-values-row-target-circle bottom-values-row-target-circle"
                                : assert.fail(`drill type unknown: ${props.selectedDrillConfiguration.getDrillType()}`)
                }`
                }
                >
                    <td>Average</td>
                    {[trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <>
                            <td>{props.shotDatas.length > 0 ? computeAverage(strokesGainedValues).toFixed(3) : ""}</td>
                            <td>{props.shotDatas.length > 0 ? computeAverage(trackmanScoreValues).toFixed(1) : ""}</td>
                        </>
                        : null}
                    {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <td>{props.shotDatas.length > 0 ? computeAverage(spinScoreValues).toFixed(1) : ""}</td>
                        : null}
                    {[targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ?
                        <td>{props.shotDatas.length > 0 ? computeAverage(targerCircleScoreValues).toFixed(1) : ""}</td>
                        : null}
                    <td>{props.shotDatas.length > 0 ? computeAverage(targetDistanceInUnitAsNumberValues).toFixed(2) : ""}</td>
                    <td>{props.shotDatas.length > 0 ? computeAverage(carryValues).toFixed(2) : ""}</td>
                    <td>{props.shotDatas.length > 0 ? computeAverage(totalDistanceInUnitAsNumberValues).toFixed(2) : ""}</td>
                    <td>{props.shotDatas.length > 0 ? computeAverage(offlineInUnitAsNumberValues).toFixed(2) : ""}</td>
                    {[trackmanScoreAndShotsGainedDrillType, targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <>
                            <td>{props.shotDatas.length > 0 ? computeAverage(absoluteDeviationInUnitAsNumberValues).toFixed(2) : ""}</td>
                            <td>{props.shotDatas.length > 0 ? computeAverage(relativeDeviationValues).toFixed(1) : ""}</td>
                        </>
                        : null}
                    {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <>
                            <td>{props.shotDatas.length > 0 ? computeAverage(targetSpinInRpmValues).toFixed(0) : ""}</td>
                            <td>{props.shotDatas.length > 0 ? computeAverage(totalSpinInRpmValues).toFixed(0) : ""}</td>
                        </>
                        : null}
                </tr>
                {props.selectedDrillConfiguration.getNumberOfDropShots() > 0
                    ? <tr className={`truncated-average-values-row bottom-values-row ${
                        [trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                            ? "truncated-average-values-row-trackman-score-and-shots-gained bottom-values-row-trackman-score-and-shots-gained"
                            : [spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                                ? "truncated-average-values-row-spin bottom-values-row-spin"
                                : [targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                                    ? "truncated-average-values-row-target-circle bottom-values-row-target-circle"
                                    : assert.fail(`drill type unknown: ${props.selectedDrillConfiguration.getDrillType()}`)
                    }`
                    }
                    >
                        <td>Trunc&nbsp;Avg&nbsp;({props.shotDatas.length - computeNumberOfShotsToDrop(props.shotDatas.length, props.selectedDrillConfiguration.getNumberOfDropShots())}/{props.shotDatas.length})
                        </td>
                        {[trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                            ? <>
                                <td>{props.shotDatas.length > 0 ? computeAverage(strokesGainedValues, props.selectedDrillConfiguration.getNumberOfDropShots()).toFixed(3) : ""}</td>
                                <td>{props.shotDatas.length > 0 ? computeAverage(trackmanScoreValues, props.selectedDrillConfiguration.getNumberOfDropShots()).toFixed(1) : ""}</td>
                            </>
                            : null}
                        {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                            ?
                            <td>{props.shotDatas.length > 0 ? computeAverage(spinScoreValues, props.selectedDrillConfiguration.getNumberOfDropShots()).toFixed(1) : ""}</td>
                            : null}
                        {[targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                            ?
                            <td>{props.shotDatas.length > 0 ? computeAverage(targerCircleScoreValues, props.selectedDrillConfiguration.getNumberOfDropShots()).toFixed(1) : ""}</td>
                            : null}
                        <td>{props.shotDatas.length > 0 ? computeAverage(targetDistanceInUnitAsNumberValues, props.selectedDrillConfiguration.getNumberOfDropShots()).toFixed(2) : ""}</td>
                        <td>{props.shotDatas.length > 0 ? computeAverage(carryValues, props.selectedDrillConfiguration.getNumberOfDropShots()).toFixed(2) : ""}</td>
                        <td>{props.shotDatas.length > 0 ? computeAverage(totalDistanceInUnitAsNumberValues, props.selectedDrillConfiguration.getNumberOfDropShots()).toFixed(2) : ""}</td>
                        <td>{props.shotDatas.length > 0 ? computeAverage(offlineInUnitAsNumberValues, props.selectedDrillConfiguration.getNumberOfDropShots()).toFixed(2) : ""}</td>
                        {[trackmanScoreAndShotsGainedDrillType, targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                            ? <>
                                <td>{props.shotDatas.length > 0 ? computeAverage(absoluteDeviationInUnitAsNumberValues, props.selectedDrillConfiguration.getNumberOfDropShots()).toFixed(2) : ""}</td>
                                <td>{props.shotDatas.length > 0 ? computeAverage(relativeDeviationValues, props.selectedDrillConfiguration.getNumberOfDropShots()).toFixed(1) : ""}</td>
                            </>
                            : null}
                        {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                            ? <>
                                <td>{props.shotDatas.length > 0 ? computeAverage(targetSpinInRpmValues, props.selectedDrillConfiguration.getNumberOfDropShots()).toFixed(0) : ""}</td>
                                <td>{props.shotDatas.length > 0 ? computeAverage(totalSpinInRpmValues, props.selectedDrillConfiguration.getNumberOfDropShots()).toFixed(0) : ""}</td>
                            </>
                            : null}
                    </tr>
                    : null}
                <tr className={`consistency-values-row bottom-values-row ${
                    [trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? "bottom-values-row-trackman-score-and-shots-gained"
                        : [spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                            ? "bottom-values-row-spin"
                            : [targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                                ? "bottom-values-row-target-circle"
                                : assert.fail(`drill type unknown: ${props.selectedDrillConfiguration.getDrillType()}`)
                }`
                }
                >
                    <td>Consistency</td>
                    {[trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ?
                        <>
                            <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(strokesGainedValues).toFixed(3) : ""}</td>
                            <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(trackmanScoreValues).toFixed(1) : ""}</td>
                        </>
                        : null}
                    {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ?
                        <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(spinScoreValues).toFixed(1) : ""}</td>
                        : null}
                    {[targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ?
                        <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(targerCircleScoreValues).toFixed(1) : ""}</td>
                        : null}
                    <td></td>
                    <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(carryValues).toFixed(2) : ""}</td>
                    <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(totalDistanceInUnitAsNumberValues).toFixed(2) : ""}</td>
                    <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(offlineInUnitAsNumberValues).toFixed(2) : ""}</td>
                    {[trackmanScoreAndShotsGainedDrillType, targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <>
                            <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(absoluteDeviationInUnitAsNumberValues).toFixed(2) : ""}</td>
                            <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(relativeDeviationValues).toFixed(1) : ""}</td>
                        </>
                        : null}
                    {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                        ? <>
                            <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(targetSpinInRpmValues).toFixed(0) : ""}</td>
                            <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(totalSpinInRpmValues).toFixed(0) : ""}</td>
                        </>
                        : null}
                </tr>
                </tbody>
            </table>
        </div>
    );
}
