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

const shotDataRows = (columns: (string | JSX.Element)[][]): JSX.Element => {
    return (
        <div className="shot-data-columns">
            {columns.map((column: string[]) => {
                return (
                    <div className="shot-data-column">
                        {column.map((value: string, index: number) => (
                            <div className={`shot-data-value ${
                                index === 0 ? "shot-data-header-0" : index === 1 ? "shot-data-header-1" : ""
                            }`}>
                                {value}
                            </div>)
                        )}
                    </div>)
            })}
        </div>);
}

export const AllShotsTable: React.FC<IAllShotsTableProps> = (props: IAllShotsTableProps): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.shotDatas, "!props.shotDatas");
    assert(!!props.selectedDrillConfiguration, "AllShotsTable - !props.selectedDrillConfiguration");

    const empty: JSX.Element = <span>&nbsp;</span>;
    const ids: (string | JSX.Element)[] = props.shotDatas.map((shotData: IShotData) => shotData.id.toString(10))
    ids.unshift(empty);
    ids.unshift("Shot");

    const strokesGaineds: (string | JSX.Element)[] = props.shotDatas.map((shotData: IShotData) => {
        // compute strokes gained
        const averageStrokesFromStartDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromStartDistance(shotData.targetDistance);
        const absoluteDeviation: Unit = computeAbsoluteDeviation(shotData);
        const averageStrokesFromEndDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromEndDistance(absoluteDeviation);
        const strokesGained: number = computeStrokesGained(averageStrokesFromStartDistance, averageStrokesFromEndDistance);
        return strokesGained.toFixed(3);
    })
    strokesGaineds.unshift("Strokes");
    strokesGaineds.unshift("Gained");

    const trackmanScores: (string | JSX.Element)[] = props.shotDatas.map((shotData: IShotData) => {
        const absoluteDeviation: Unit = computeAbsoluteDeviation(shotData);
        return computeTrackmanScore(shotData.targetDistance, absoluteDeviation).toFixed(1);
    })
    trackmanScores.unshift(empty);
    trackmanScores.unshift("Score");

    const targets: (string | JSX.Element)[] = props.shotDatas.map((shotData: IShotData) => shotData.targetDistance.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2));
    targets.unshift(props.selectedDrillConfiguration.getUnit());
    targets.unshift("Target");

    const carrys: (string | JSX.Element)[] = props.shotDatas.map((shotData: IShotData) => shotData.carry.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2));
    carrys.unshift(props.selectedDrillConfiguration.getUnit());
    carrys.unshift("Carry");

    const totals: (string | JSX.Element)[] = props.shotDatas.map((shotData: IShotData) => shotData.totalDistance.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2));
    totals.unshift(props.selectedDrillConfiguration.getUnit());
    totals.unshift("Total");

    const offlines: (string | JSX.Element)[] = props.shotDatas.map((shotData: IShotData) => shotData.offline.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2));
    offlines.unshift(props.selectedDrillConfiguration.getUnit());
    offlines.unshift("Offline");

    const absoluteDeviations: (string | JSX.Element)[] = props.shotDatas.map((shotData: IShotData) => computeAbsoluteDeviation(shotData).toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2));
    absoluteDeviations.unshift(props.selectedDrillConfiguration.getUnit());
    absoluteDeviations.unshift("Abs. Dev.");

    const relativeDeviations: (string | JSX.Element)[] = props.shotDatas.map((shotData: IShotData) => (computeRelativeDeviation(shotData) * 100).toFixed(1));
    relativeDeviations.unshift("%");
    relativeDeviations.unshift("Rel. Dev.");

    return (
        <div className="all-shots-table">
            {shotDataRows([ids, strokesGaineds, trackmanScores, targets, carrys, totals, offlines, absoluteDeviations, relativeDeviations])}
        </div>
    );
}
