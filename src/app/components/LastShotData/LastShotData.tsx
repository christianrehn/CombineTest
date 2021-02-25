import {IShotData} from "../../model/ShotData";
import React from "react";
import './LastShotData.scss';

export interface ILastShotData {
    lastShot: IShotData,
    absoluteDeviation: number,
    relativeDeviation: number,
    absoluteDeviationSum: number,
    shotDatas: IShotData[],
    relativeDeviationSum: number
}

export const LastShotData: React.FC<ILastShotData> = (props: ILastShotData): JSX.Element => {
    const unit: string = "m";

    return (
        <div className="last-shot-table">
            {/* data for last shot */}
            <div className="last-shot__row">
                <div className="last-shot-item__label">Target</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? `${props.lastShot.targetDistance.toFixed(2)}` : ""} </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? unit : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Carry</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? `${props.lastShot.carry.toFixed(2)}` : ""} </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? unit : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Offline</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? `${props.lastShot.offline.toFixed(2)}` : ""} </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? unit : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Absolute Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.absoluteDeviation ? `${props.absoluteDeviation.toFixed(2)}` : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? unit : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Relative Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.relativeDeviation ? `${(props.relativeDeviation * 100).toFixed(1)}` : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? `%` : ""} </div>
            </div>


            {/* data for all shots */}
            <div className="last-shot__row last-shot__row_all_shots_data_start">
                <div className="last-shot-item__label">Sum Absolute Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.lastShot ? `${props.absoluteDeviationSum.toFixed(2)}` : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? unit : ""} </div>
            </div>

            <div className="last-shot__row">
                <div className="last-shot-item__label">Average Absolute Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.lastShot ? `${(props.absoluteDeviationSum / props.shotDatas.length).toFixed(2)}` : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? unit : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Sum Relative Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.lastShot ? `${props.relativeDeviationSum.toFixed(1)}` : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? `%` : ""} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Average Relative Deviation</div>
                <div className="last-shot-item__data"> {
                    !!props.lastShot ? `${(props.relativeDeviationSum / props.shotDatas.length).toFixed(1)}` : ""
                } </div>
                <div className="last-shot-item__unit"> {!!props.lastShot ? `%` : ""} </div>
            </div>
            <div className="last-shot__row">
            </div>
        </div>
    );
}
