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

export interface IAllShotsTableProps {
    lastShot: IShotData,
    shotDatas: IShotData[],
    selectedDrillConfiguration: IDrillConfiguration;
}

const shotDataTable = (props: IAllShotsTableProps): JSX.Element => {
    const empty: JSX.Element = <span>&nbsp;</span>;
    let strokesGainedValues: number[] = [];
    let trackmanScoreValues: number[] = [];
    let targetDistanceValues: number[] = [];
    let carryValues: number[] = [];
    let totalDistanceValues: number[] = [];
    let offlineValues: number[] = [];
    let absoluteDeviationValues: number[] = [];
    let relativeDeviationValues: number[] = [];
    return (
        <table className="table-with-shots">
            <tr className="parameter-names-row">
                <td>Shot</td>
                <td>Gained</td>
                <td>Score</td>
                <td>Target</td>
                <td>Carry</td>
                <td>Total</td>
                <td>Offline</td>
                <td>Abs. Dev.</td>
                <td>Rel. Dev.</td>
            </tr>
            <tr className="parameter-units-row">
                <td>{empty}</td>
                <td>Strokes</td>
                <td>{empty}</td>
                <td>{props.selectedDrillConfiguration.getUnit()}</td>
                <td>{props.selectedDrillConfiguration.getUnit()}</td>
                <td>{props.selectedDrillConfiguration.getUnit()}</td>
                <td>{props.selectedDrillConfiguration.getUnit()}</td>
                <td>{props.selectedDrillConfiguration.getUnit()}</td>
                <td>%</td>
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

                    const targetDistance: number = shotData.targetDistance.toNumber(props.selectedDrillConfiguration.getUnit());
                    targetDistanceValues.push(targetDistance);

                    const carry: number = shotData.carry.toNumber(props.selectedDrillConfiguration.getUnit());
                    carryValues.push(carry);

                    const totalDistance: number = shotData.totalDistance.toNumber(props.selectedDrillConfiguration.getUnit());
                    totalDistanceValues.push(totalDistance);

                    const offline: number = shotData.offline.toNumber(props.selectedDrillConfiguration.getUnit());
                    offlineValues.push(offline);

                    const absoluteDeviationAsNumber: number = computeAbsoluteDeviation(shotData).toNumber(props.selectedDrillConfiguration.getUnit());
                    absoluteDeviationValues.push(absoluteDeviationAsNumber);

                    const relativeDeviation: number = (computeRelativeDeviation(shotData) * 100);
                    relativeDeviationValues.push(relativeDeviation);

                    return <tr className="row-with-shot-details">
                        <td>{(index + 1).toString(10)}</td>
                        <td>{strokesGained.toFixed(3)}</td>
                        <td>{trackmanScore.toFixed(1)}</td>
                        <td>{targetDistance.toFixed(2)}</td>
                        <td>{carry.toFixed(2)}</td>
                        <td>{totalDistance.toFixed(2)}</td>
                        <td>{offline.toFixed(2)}</td>
                        <td>{absoluteDeviationAsNumber.toFixed(2)}</td>
                        <td>{relativeDeviation.toFixed(1)}</td>
                    </tr>;
                })
            }
            <tr className="average-values-row bottom-values-row">
                <td>Average</td>
                <td>{props.shotDatas.length > 0 ? computeAverage(strokesGainedValues).toFixed(3) : ""}</td>
                <td>{props.shotDatas.length > 0 ? computeAverage(trackmanScoreValues).toFixed(1) : ""}</td>
                <td>{props.shotDatas.length > 0 ? computeAverage(targetDistanceValues).toFixed(2) : ""}</td>
                <td>{props.shotDatas.length > 0 ? computeAverage(carryValues).toFixed(2) : ""}</td>
                <td>{props.shotDatas.length > 0 ? computeAverage(totalDistanceValues).toFixed(2) : ""}</td>
                <td>{props.shotDatas.length > 0 ? computeAverage(offlineValues).toFixed(2) : ""}</td>
                <td>{props.shotDatas.length > 0 ? computeAverage(absoluteDeviationValues).toFixed(2) : ""}</td>
                <td>{props.shotDatas.length > 0 ? computeAverage(relativeDeviationValues).toFixed(1) : ""}</td>
            </tr>
            <tr className="consistency-values-row bottom-values-row">
                <td>Consistency</td>
                <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(strokesGainedValues).toFixed(3) : ""}</td>
                <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(trackmanScoreValues).toFixed(1) : ""}</td>
                <td></td>
                <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(carryValues).toFixed(2) : ""}</td>
                <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(totalDistanceValues).toFixed(2) : ""}</td>
                <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(offlineValues).toFixed(2) : ""}</td>
                <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(absoluteDeviationValues).toFixed(2) : ""}</td>
                <td>{props.shotDatas.length > 0 ? computeStandardDeviationEntirePopulation(relativeDeviationValues).toFixed(1) : ""}</td>
            </tr>
        </table>
    );
}

export const AllShotsTable: React.FC<IAllShotsTableProps> = (props: IAllShotsTableProps): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.shotDatas, "!props.shotDatas");
    assert(!!props.selectedDrillConfiguration, "AllShotsTable - !props.selectedDrillConfiguration");

    return (
        <div className="all-shots-component">
            {shotDataTable(props)}
        </div>
    );
}
