import {computeAbsoluteDeviation, computeRelativeDeviation, IShotData} from "../../model/ShotData";
import React from "react";
import './AllShotsTable.scss';
import {assert} from "chai";
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import {Unit} from "mathjs";
import {computeStrokesGained} from "../../model/StrokesGained";
import {computeTrackmanScore} from "../../model/TrackmanScore";

export interface IAllShotsTableProps {
    lastShot: IShotData,
    shotDatas: IShotData[],
    selectedDrillConfiguration: IDrillConfiguration;
}

const shotDataTable = (props: IAllShotsTableProps): JSX.Element => {
    const empty: JSX.Element = <span>&nbsp;</span>;
    let strokesGainedSum: number = 0;
    let trackmanScoreSum: number = 0;
    let relativeDeviationSum: number = 0;
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
                    strokesGainedSum += strokesGained;
                    const trackmanScore: number = computeTrackmanScore(shotData.targetDistance, absoluteDeviation);
                    trackmanScoreSum += trackmanScore;
                    const relativeDeviation: number = (computeRelativeDeviation(shotData) * 100);
                    relativeDeviationSum += relativeDeviation;
                    return <tr className="row-with-shot-details">
                        <td>{(index + 1).toString(10)}</td>
                        <td>{strokesGained.toFixed(3)}</td>
                        <td>{trackmanScore.toFixed(1)}</td>
                        <td>{shotData.targetDistance.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2)}</td>
                        <td>{shotData.carry.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2)}</td>
                        <td>{shotData.totalDistance.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2)}</td>
                        <td>{shotData.offline.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2)}</td>
                        <td>{computeAbsoluteDeviation(shotData).toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2)}</td>
                        <td>{relativeDeviation.toFixed(1)}</td>
                    </tr>;
                })
            }
            <tr className="average-values-row bottom-values-row">
                <td>Average</td>
                <td>{props.shotDatas.length > 0 ? (strokesGainedSum / props.shotDatas.length).toFixed(3) : ""}</td>
                <td>{props.shotDatas.length > 0 ? (trackmanScoreSum / props.shotDatas.length).toFixed(1) : ""}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{props.shotDatas.length > 0 ? (relativeDeviationSum / props.shotDatas.length).toFixed(1) : ""}</td>
            </tr>
            <tr className="consistency-values-row bottom-values-row">
                <td>Consistency</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
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
