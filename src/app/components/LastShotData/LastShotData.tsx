import {computeAbsoluteDeviation, computeRelativeDeviation, IShotData} from "../../model/ShotData";
import React from "react";
import './LastShotData.scss';
import * as math from "mathjs";
import {Unit} from "mathjs";
import {AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "../../model/AverageStrokesData";
import {assert} from "chai";
import {IDistancesGenerator} from "../../model/DistancesGenerator";

const SHOW_ADDITIONAL_DATA_FOR_ALL_SHOTS: boolean = false;

const additionalDataForAllShots = (props: ILastShotData) => {
    assert(!!props, "!props");

    const absoluteDeviationSum: Unit = props.shotDatas
        .map((shotData: IShotData) => computeAbsoluteDeviation(shotData))
        .reduce((accumulator: Unit, currentValue: Unit) => math.add(accumulator, currentValue) as Unit,
            math.unit(0, props.selectedDistancesGenerator.unit));

    const relativeDeviationSum: number = props.shotDatas
        .map((shotData: IShotData) => computeRelativeDeviation(shotData))
        .reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) * 100;


    const distanceUnit: string = !!props.lastShot ? props.selectedDistancesGenerator.unit : "";

    return <>
        <div className="last-shot__row last-shot__new_shots_data_section_start">
            <div className="last-shot-item__label">Sum Absolute Deviation</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? absoluteDeviationSum.toNumber(props.selectedDistancesGenerator.unit).toFixed(2) : ""
            } </div>
            <div
                className="last-shot-item__unit"> {distanceUnit} </div>
        </div>

        <div className="last-shot__row">
            <div className="last-shot-item__label">Average Absolute Deviation</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? (absoluteDeviationSum.toNumber(props.selectedDistancesGenerator.unit) / props.shotDatas.length).toFixed(2) : ""
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
    </>;
}

const shotsGainedData = (
    props: ILastShotData,
    targetDistance: string,
    distanceUnit: string,
    absoluteDeviation: string): JSX.Element | null => {
    if (!props.lastShot) {
        return null;
    }
    const averageStrokesFromTargetDistance: number =
        props.averageStrokesDataMap.get(props.selectedDistancesGenerator.averageShotsGroundTypeEnum)?.computeAverageStrokesToHole(
            props.lastShot.targetDistance,
        );

    const averageStrokesFromAbsoluteDeviation: number =
        props.averageStrokesDataMap.get(AverageStrokesDataGroundTypeEnum.Green)?.computeAverageStrokesToHole(
            props.absoluteDeviation,
        );

    return (<>
        <div className="last-shot__row last-shot__new_shots_data_section_start">
            <div className="last-shot-item__label">From {targetDistance} {distanceUnit}</div>
            <div className="last-shot-item__data"> {
                !!averageStrokesFromTargetDistance ? averageStrokesFromTargetDistance.toFixed(3) : ""
            } </div>
            <div
                className="last-shot-item__unit"> Strokes
            </div>
        </div>
        <div className="last-shot__row">
            <div className="last-shot-item__label">Remaining from {absoluteDeviation} {distanceUnit}</div>
            <div className="last-shot-item__data"> {
                !!averageStrokesFromAbsoluteDeviation ? averageStrokesFromAbsoluteDeviation.toFixed(3) : ""
            } </div>
            <div
                className="last-shot-item__unit"> Strokes
            </div>
        </div>
        <div className="last-shot__row">
            <div className="last-shot-item__label">Gained</div>
            <div className="last-shot-item__data"> {
                !!averageStrokesFromTargetDistance && !!averageStrokesFromAbsoluteDeviation ?
                    (averageStrokesFromTargetDistance - averageStrokesFromAbsoluteDeviation - 1).toFixed(3) : ""
            } </div>
            <div
                className="last-shot-item__unit"> Strokes
            </div>
        </div>
    </>);
}

export interface ILastShotData {
    lastShot: IShotData,
    absoluteDeviation: Unit,
    relativeDeviation: number,
    shotDatas: IShotData[],
    selectedDistancesGenerator: IDistancesGenerator;
    averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>;
}

export const LastShotData: React.FC<ILastShotData> = (props: ILastShotData): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.shotDatas, "!props.shotDatas");
    assert(!!props.selectedDistancesGenerator, "!props.selectedDistancesGenerator");
    assert(!!props.averageStrokesDataMap, "!props.averageStrokesDataMap");


    const targetDistance: string = !!props.lastShot ? props.lastShot.targetDistance.toNumber(props.selectedDistancesGenerator.unit).toFixed(2) : "";
    const absoluteDeviation: string = !!props.absoluteDeviation ? props.absoluteDeviation.toNumber(props.selectedDistancesGenerator.unit).toFixed(2) : "";
    const distanceUnit: string = !!props.lastShot ? props.selectedDistancesGenerator.unit : "";

    return (
        <div className="last-shot-table">
            {/* data for last shot */}
            <div className="last-shot__row">
                <div className="last-shot-item__label">Target</div>
                <div
                    className="last-shot-item__data"> {targetDistance} </div>
                <div
                    className="last-shot-item__unit"> {distanceUnit} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Carry</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.carry.toNumber(props.selectedDistancesGenerator.unit).toFixed(2) : ""} </div>
                <div
                    className="last-shot-item__unit"> {distanceUnit} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Offline</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.offline.toNumber(props.selectedDistancesGenerator.unit).toFixed(2) : ""} </div>
                <div
                    className="last-shot-item__unit"> {distanceUnit} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Absolute Deviation</div>
                <div className="last-shot-item__data"> {
                    absoluteDeviation
                } </div>
                <div
                    className="last-shot-item__unit"> {distanceUnit} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Relative Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.relativeDeviation ? (props.relativeDeviation * 100).toFixed(1) : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? `%` : ""} </div>
            </div>
            {shotsGainedData(props, targetDistance, distanceUnit, absoluteDeviation)}

            {/* data for all shots */}
            {SHOW_ADDITIONAL_DATA_FOR_ALL_SHOTS ? additionalDataForAllShots(props) : null}
        </div>
    );
}
