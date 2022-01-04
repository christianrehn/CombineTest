import {computeAbsoluteDeviation, computeRelativeDeviation, IShotData} from "../../model/ShotData";
import React from "react";
import './LastShotData.scss';
import * as math from "mathjs";
import {Unit} from "mathjs";
import {assert} from "chai";
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";

const SHOW_ADDITIONAL_DATA_FOR_ALL_SHOTS: boolean = false;

const additionalDataForAllShots = (props: ILastShotData) => {
    assert(!!props, "!props");

    const absoluteDeviationSum: Unit = props.shotDatas
        .map((shotData: IShotData) => computeAbsoluteDeviation(shotData))
        .reduce((accumulator: Unit, currentValue: Unit) => math.add(accumulator, currentValue) as Unit,
            math.unit(0, props.selectedDrillConfiguration.getUnit()));

    const relativeDeviationSum: number = props.shotDatas
        .map((shotData: IShotData) => computeRelativeDeviation(shotData))
        .reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) * 100;


    const distanceUnit: string = !!props.lastShot ? props.selectedDrillConfiguration.getUnit() : "";

    return (<div>
        <div className="last-shot__row last-shot__new_shots_data_section_start">
            <div className="last-shot-item__label">Sum Absolute Deviation</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? absoluteDeviationSum.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2) : ""
            } </div>
            <div
                className="last-shot-item__unit"> {distanceUnit} </div>
        </div>

        <div className="last-shot__row">
            <div className="last-shot-item__label">Average Absolute Deviation</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? (absoluteDeviationSum.toNumber(props.selectedDrillConfiguration.getUnit()) / props.shotDatas.length).toFixed(2) : ""
            } </div>
            <div
                className="last-shot-item__unit"> {distanceUnit} </div>
        </div>
        <div className="last-shot__row">
            <div className="last-shot-item__label">Sum Relative Deviation</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? relativeDeviationSum.toFixed(1) : ""
            } </div>
            <div className="last-shot-item__unit"> {!!props.lastShot ? `%` : ""} </div>
        </div>
        <div className="last-shot__row last-shot__new_shots_data_section_start">
            <div className="last-shot-item__label">Average Relative Deviation</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? (relativeDeviationSum / props.shotDatas.length).toFixed(1) : ""
            } </div>
            <div className="last-shot-item__unit"> {!!props.lastShot ? `%` : ""} </div>
        </div>
        <div className="last-shot__row">
        </div>
    </div>);
}

const computeStrokesGained = (averageStrokesFromStartDistance: number, averageStrokesFromEndDistance: number): number => {
    return !!averageStrokesFromStartDistance && !!averageStrokesFromEndDistance
        ? (averageStrokesFromStartDistance - averageStrokesFromEndDistance - 1)
        : !!averageStrokesFromStartDistance && !averageStrokesFromEndDistance // out of bounds
            ? -2
            : undefined;
}

const shotsGainedData = (props: ILastShotData, targetDistance: string): JSX.Element[] => {
    if (!props.lastShot) {
        return [];
    }

    const averageStrokesFromStartDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromStartDistance(props.lastShot.targetDistance);
    const absoluteDeviation: Unit = props.shotDatas.length > 0 ? computeAbsoluteDeviation(props.shotDatas[props.shotDatas.length - 1]) : undefined;
    const averageStrokesFromEndDistance: number | undefined = props.selectedDrillConfiguration.computeAverageStrokesFromEndDistance(absoluteDeviation);
    const strokesGained: number = computeStrokesGained(averageStrokesFromStartDistance, averageStrokesFromEndDistance);

    const strokesGainedSum: number = props.shotDatas
        .map((shotData: IShotData) => {
            const averageStrokesFromStartDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromStartDistance(shotData.targetDistance);
            const absoluteDeviation: Unit = computeAbsoluteDeviation(shotData);
            const averageStrokesFromEndDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromEndDistance(absoluteDeviation);
            return computeStrokesGained(averageStrokesFromStartDistance, averageStrokesFromEndDistance);
        })
        .reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);

    const absoluteDeviationString: string = !!absoluteDeviation ? absoluteDeviation.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2) : "";
    const distanceUnit: string = !!props.lastShot ? props.selectedDrillConfiguration.getUnit() : "";

    return [
        <div
            key="averageStrokesFromTargetDistance"
            className="last-shot__row last-shot__new_shots_data_section_start">
            <div className="last-shot-item__label">Starting from {targetDistance} {distanceUnit}</div>
            <div className="last-shot-item__data"> {
                !!averageStrokesFromStartDistance ? averageStrokesFromStartDistance.toFixed(3) : ""
            } </div>
            <div
                className="last-shot-item__unit"> Strokes
            </div>
        </div>,
        <div
            key="averageStrokesFromAbsoluteDeviation"
            className="last-shot__row">
            <div className="last-shot-item__label">Remaining from {absoluteDeviationString} {distanceUnit}</div>
            <div className="last-shot-item__data"> {
                !!averageStrokesFromEndDistance ? averageStrokesFromEndDistance.toFixed(3) : ""
            } </div>
            <div className="last-shot-item__unit">Strokes</div>
        </div>,
        <div
            key="strokesGained"
            className="last-shot__row last-shot__gained-row">
            <div className="last-shot-item__label">Gained</div>
            <div className="last-shot-item__data"> {
                !!strokesGained ? strokesGained.toFixed(3) : ""
            } </div>
            <div
                className="last-shot-item__unit"> Strokes
            </div>
        </div>,
        <div
            key="strokesGainedSum"
            className="last-shot__row last-shot__gained-row last-shot__sum-gained-row">
            <div className="last-shot-item__label">Sum Gained</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? strokesGainedSum.toFixed(3) : ""
            } </div>
            <div
                className="last-shot-item__unit"> Strokes
            </div>
        </div>
    ];
}

const computeTrackmanScore = (targetDistance: Unit): number => {
    return 48;
}

const trackmanScoreData = (props: ILastShotData): JSX.Element[] => {
    if (!props.lastShot) {
        return [];
    }

    const trackmanScore: number = computeTrackmanScore(props.lastShot.targetDistance);
    const trackmanScoreAverage: number = 42;

    return [
        <div
            key="trackmanScore"
            className="last-shot__row last-shot__trackmanscore-row">
            <div className="last-shot-item__label">Score</div>
            <div className="last-shot-item__data"> {
                !!trackmanScore ? trackmanScore.toFixed(1) : ""
            } </div>
        </div>,
        <div
            key="trackmanScoreAverage"
            className="last-shot__row last-shot__trackmanscore-row last-shot__avg-trackmanscore-row">
            <div className="last-shot-item__label">Score Average</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? trackmanScoreAverage.toFixed(1) : ""
            } </div>
        </div>,
        <div
            key="trackmanConsistency"
            className="last-shot__row last-shot__trackmanscore-row last-shot__trackmanconsistency-row">
            <div className="last-shot-item__label">Consistency</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? "TODO" : ""
            } </div>
        </div>
    ];
}

export interface ILastShotData {
    lastShot: IShotData,
    shotDatas: IShotData[],
    selectedDrillConfiguration: IDrillConfiguration;
}

export const LastShotData: React.FC<ILastShotData> = (props: ILastShotData): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.shotDatas, "!props.shotDatas");
    assert(!!props.selectedDrillConfiguration, "LastShotData - !props.selectedDrillConfiguration");

    const absoluteDeviation: Unit | undefined = props.shotDatas.length > 0 ? computeAbsoluteDeviation(props.shotDatas[props.shotDatas.length - 1]) : undefined;
    const relativeDeviation: number | undefined = props.shotDatas.length > 0 ? computeRelativeDeviation(props.shotDatas[props.shotDatas.length - 1]) : undefined;

    const targetDistanceString: string = !!props.lastShot ? props.lastShot.targetDistance.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2) : "";
    const absoluteDeviationString: string = !!absoluteDeviation ? absoluteDeviation.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2) : "";
    const relativeDeviationString: string = !!relativeDeviation ? (relativeDeviation * 100).toFixed(1) : "";
    const distanceUnit: string = !!props.lastShot ? props.selectedDrillConfiguration.getUnit() : "";

    return (
        <div className="last-shot-table">
            {/* data for last shot */}
            <div className="last-shot__row">
                <div className="last-shot-item__label">Target</div>
                <div
                    className="last-shot-item__data"> {targetDistanceString} </div>
                <div
                    className="last-shot-item__unit"> {distanceUnit} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Carry</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.carry.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2) : ""} </div>
                <div
                    className="last-shot-item__unit"> {distanceUnit} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Total</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.totalDistance.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2) : ""} </div>
                <div
                    className="last-shot-item__unit"> {distanceUnit} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Offline</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.offline.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2) : ""} </div>
                <div
                    className="last-shot-item__unit"> {distanceUnit} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Absolute Deviation</div>
                <div className="last-shot-item__data"> {absoluteDeviationString} </div>
                <div
                    className="last-shot-item__unit"> {distanceUnit} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Relative Deviation</div>
                <div className="last-shot-item__data"> {relativeDeviationString} </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? `%` : ""} </div>
            </div>
            {shotsGainedData(props, targetDistanceString)}
            {trackmanScoreData(props)}

            {/* data for all shots */}
            {SHOW_ADDITIONAL_DATA_FOR_ALL_SHOTS ? additionalDataForAllShots(props) : null}
        </div>
    );
}
