import {IShotData} from "../../model/ShotData";
import React from "react";
import './LastShotData.scss';
import {Unit} from "mathjs";
import {AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "../../model/AverageStrokesData";
import {assert} from "chai";
import {IDistancesGenerator} from "../../model/DistancesGenerator";

export interface ILastShotData {
    lastShot: IShotData,
    absoluteDeviation: Unit,
    relativeDeviation: number,
    absoluteDeviationSum: Unit,
    relativeDeviationSum: number,
    shotDatas: IShotData[],
    selectedDistancesGenerator: IDistancesGenerator;
    averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>;
}

export const LastShotData: React.FC<ILastShotData> = (props: ILastShotData): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.absoluteDeviationSum, "!props.absoluteDeviationSum");
    assert(!!props.shotDatas, "!props.shotDatas");
    assert(!!props.selectedDistancesGenerator, "!props.selectedDistancesGenerator");
    assert(!!props.averageStrokesDataMap, "!props.averageStrokesDataMap");


    const averageStrokesFromAbsoluteDeviation: number =
        props.averageStrokesDataMap.get(AverageStrokesDataGroundTypeEnum.Green)?.computeAverageStrokesToHole(
            props.absoluteDeviation,
        );

    return (
        <div className="last-shot-table">
            {/* data for last shot */}
            <div className="last-shot__row">
                <div className="last-shot-item__label">Target</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.targetDistance.toNumber(props.selectedDistancesGenerator.unit).toFixed(2) : ""} </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? props.selectedDistancesGenerator.unit : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Carry</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.carry.toNumber(props.selectedDistancesGenerator.unit).toFixed(2) : ""} </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? props.selectedDistancesGenerator.unit : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Offline</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.offline.toNumber(props.selectedDistancesGenerator.unit).toFixed(2) : ""} </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? props.selectedDistancesGenerator.unit : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Absolute Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.absoluteDeviation ? props.absoluteDeviation.toNumber(props.selectedDistancesGenerator.unit).toFixed(2) : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? props.selectedDistancesGenerator.unit : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Relative Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.relativeDeviation ? (props.relativeDeviation * 100).toFixed(1) : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? `%` : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Average Remaining Strokes to Hole</div>
                <div className="last-shot-item__data"> {
                    !!averageStrokesFromAbsoluteDeviation ? averageStrokesFromAbsoluteDeviation.toFixed(3) : ""
                } </div>
            </div>


            {/* data for all shots */}
            <div className="last-shot__row last-shot__row_all_shots_data_start">
                <div className="last-shot-item__label">Sum Absolute Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.lastShot ? props.absoluteDeviationSum.toNumber(props.selectedDistancesGenerator.unit).toFixed(2) : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? props.selectedDistancesGenerator.unit : ""} </div>
            </div>

            <div className="last-shot__row">
                <div className="last-shot-item__label">Average Absolute Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.lastShot ? (props.absoluteDeviationSum.toNumber(props.selectedDistancesGenerator.unit) / props.shotDatas.length).toFixed(2) : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? props.selectedDistancesGenerator.unit : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Sum Relative Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.lastShot ? props.relativeDeviationSum.toFixed(1) : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? `%` : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Average Relative Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.lastShot ? (props.relativeDeviationSum / props.shotDatas.length).toFixed(1) : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? `%` : ""} </div>
            </div>
            <div className="last-shot__row">
            </div>
        </div>
    );
}
