import {IShotData} from "../../model/ShotData/ShotData";
import React from "react";
import './LastShotData.scss';
import * as math from "mathjs";
import {Unit} from "mathjs";
import {assert} from "chai";
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import {computeTrackmanScore} from "../../model/TrackmanScore";
import {computeStrokesGained} from "../../model/StrokesGained";
import {
    computeAbsoluteDeviation,
    computeAverage,
    computeRelativeDeviation,
    computeStandardDeviationEntirePopulation,
    computeSum
} from "../../util/MathUtil";
import {
    spinDrillType,
    targetCircleDrillType,
    trackmanScoreAndShotsGainedDrillType
} from "../../model/SelectValues/DrillType";
import {computeSpinScore} from "../../model/SpinScore";
import {computeTargetCircleScore} from "../../model/TargetCircleScore";

const SHOW_ADDITIONAL_DATA_FOR_ALL_SHOTS: boolean = false;

const additionalDataForAllShots = (props: ILastShotDataProps) => {
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

const shotsGainedData = (props: ILastShotDataProps, targetDistance: string): JSX.Element[] => {
    if (!props.lastShot) {
        return [];
    }

    const averageStrokesFromStartDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromStartDistance(props.lastShot.getTargetDistance());
    const absoluteDeviation: Unit = props.shotDatas.length > 0 ? computeAbsoluteDeviation(props.shotDatas[props.shotDatas.length - 1]) : undefined;
    const averageStrokesFromEndDistance: number | undefined = props.selectedDrillConfiguration.computeAverageStrokesFromEndDistance(absoluteDeviation);
    const strokesGained: number = computeStrokesGained(averageStrokesFromStartDistance, averageStrokesFromEndDistance);

    const strokesGainedValues: number[] = props.shotDatas.map((shotData: IShotData) => {
        const averageStrokesFromStartDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromStartDistance(shotData.getTargetDistance());
        const absoluteDeviation: Unit = computeAbsoluteDeviation(shotData);
        const averageStrokesFromEndDistance: number = props.selectedDrillConfiguration.computeAverageStrokesFromEndDistance(absoluteDeviation);
        return computeStrokesGained(averageStrokesFromStartDistance, averageStrokesFromEndDistance);
    });

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
            key="sumStrokesGained"
            className="last-shot__row last-shot__gained-row last-shot__sum-gained-row">
            <div className="last-shot-item__label">Sum Gained</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? computeSum(strokesGainedValues).toFixed(3) : ""
            } </div>
            <div
                className="last-shot-item__unit"> Strokes
            </div>
        </div>,
        <div
            key="averageStrokesGained"
            className="last-shot__row last-shot__gained-row last-shot__avg-gained-row">
            <div className="last-shot-item__label">Average Gained</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? computeAverage(strokesGainedValues).toFixed(3) : ""
            } </div>
        </div>,
        <div
            key="consistencyStrokesGained"
            className="last-shot__row last-shot__gained-row last-shot__consistency-gained-row">
            <div className="last-shot-item__label">Consistency Gained</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? computeStandardDeviationEntirePopulation(strokesGainedValues).toFixed(3) : ""
            } </div>
        </div>
    ];
}

const trackmanScoreData = (props: ILastShotDataProps): JSX.Element[] => {
    if (!props.lastShot) {
        return [];
    }

    const absoluteDeviation: Unit = computeAbsoluteDeviation(props.lastShot);
    const trackmanScore: number = computeTrackmanScore(props.lastShot.getTargetDistance(), absoluteDeviation);

    const trackmanScoreValues: number[] = props.shotDatas.map((shotData: IShotData) => computeTrackmanScore(shotData.getTargetDistance(), computeAbsoluteDeviation(shotData)));

    return [
        <div
            key="trackmanScore"
            className="last-shot__row last-shot__trackmanscore-row">
            <div className="last-shot-item__label">Score</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? trackmanScore.toFixed(1) : ""
            } </div>
        </div>,
        <div
            key="averageTrackmanScore"
            className="last-shot__row last-shot__trackmanscore-row last-shot__avg-trackmanscore-row">
            <div className="last-shot-item__label">Average Score</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? computeAverage(trackmanScoreValues).toFixed(1) : ""
            } </div>
        </div>,
        <div
            key="consistencyTrackmanScore"
            className="last-shot__row last-shot__trackmanscore-row last-shot__consistency-trackmanscore-row">
            <div className="last-shot-item__label">Consistency Score</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? computeStandardDeviationEntirePopulation(trackmanScoreValues).toFixed(1) : ""
            } </div>
        </div>
    ];
}

const spinScoreData = (props: ILastShotDataProps): JSX.Element[] => {
    if (!props.lastShot) {
        return [];
    }

    const spinScore: number = computeSpinScore(props.selectedDrillConfiguration, props.lastShot.getTargetDistance(), props.lastShot.getTotalSpin(), props.lastShot.getCarry());

    const spinScoreValues: number[] = props.shotDatas.map((shotData: IShotData) => computeSpinScore(props.selectedDrillConfiguration, shotData.getTargetDistance(), shotData.getTotalSpin(), shotData.getCarry()));

    return [
        <div
            key="spinScore"
            className="last-shot__row last-shot__spinscore-row">
            <div className="last-shot-item__label">Spin Score</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? spinScore.toFixed(1) : ""
            } </div>
        </div>,
        <div
            key="averageSpinScore"
            className="last-shot__row last-shot__spinscore-row last-shot__avg-spinscore-row">
            <div className="last-shot-item__label">Average Spin Score</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? computeAverage(spinScoreValues).toFixed(1) : ""
            } </div>
        </div>,
        <div
            key="consistencySpinScore"
            className="last-shot__row last-shot__spinscore-row last-shot__consistency-spinscore-row">
            <div className="last-shot-item__label">Consistency Spin Score</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? computeStandardDeviationEntirePopulation(spinScoreValues).toFixed(1) : ""
            } </div>
        </div>
    ];
}

const targetCircleScoreData = (props: ILastShotDataProps): JSX.Element[] => {
    if (!props.lastShot) {
        return [];
    }

    const absoluteDeviation: Unit = computeAbsoluteDeviation(props.lastShot);
    const targetCircleScore: number = computeTargetCircleScore(props.selectedDrillConfiguration, props.lastShot.getTargetDistance(), absoluteDeviation);

    const targetCircleScoreValues: number[] = props.shotDatas.map((shotData: IShotData) => computeTargetCircleScore(props.selectedDrillConfiguration, shotData.getTargetDistance(), absoluteDeviation));

    return [
        <div
            key="targetCircleScore"
            className="last-shot__row last-shot__targetcirclescore-row">
            <div className="last-shot-item__label">TC Score</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? targetCircleScore.toFixed(1) : ""
            } </div>
        </div>,
        <div
            key="averageTargetCircleScore"
            className="last-shot__row last-shot__targetcirclescore-row last-shot__avg-targetcirclescore-row">
            <div className="last-shot-item__label">Average TC Score</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? computeAverage(targetCircleScoreValues).toFixed(1) : ""
            } </div>
        </div>,
        <div
            key="consistencyTargetCircleScore"
            className="last-shot__row last-shot__targetcirclescore-row last-shot__consistency-targetcirclescore-row">
            <div className="last-shot-item__label">Consistency TC Score</div>
            <div className="last-shot-item__data"> {
                !!props.lastShot ? computeStandardDeviationEntirePopulation(targetCircleScoreValues).toFixed(1) : ""
            } </div>
        </div>
    ];
}

export interface ILastShotDataProps {
    lastShot: IShotData,
    shotDatas: IShotData[],
    selectedDrillConfiguration: IDrillConfiguration;
}

export const LastShotData: React.FC<ILastShotDataProps> = (props: ILastShotDataProps): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.shotDatas, "!props.shotDatas");
    assert(!!props.selectedDrillConfiguration, "LastShotData - !props.selectedDrillConfiguration");

    const absoluteDeviation: Unit | undefined = props.shotDatas.length > 0 ? computeAbsoluteDeviation(props.shotDatas[props.shotDatas.length - 1]) : undefined;
    const relativeDeviation: number | undefined = props.shotDatas.length > 0 ? computeRelativeDeviation(props.shotDatas[props.shotDatas.length - 1]) : undefined;

    const targetDistanceInUnitAsNumber: number = !!props.lastShot ? props.lastShot.getTargetDistance().toNumber(props.selectedDrillConfiguration.getUnit()) : 0;
    const targetDistanceString: string = !!props.lastShot ? targetDistanceInUnitAsNumber.toFixed(2) : "";
    const absoluteDeviationInUnitAsString: string = !!absoluteDeviation ? absoluteDeviation.toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2) : "";
    const relativeDeviationInPercentAsString: string = !!relativeDeviation ? (relativeDeviation * 100).toFixed(1) : "";
    const distanceUnit: string = !!props.lastShot ? props.selectedDrillConfiguration.getUnit() : "";
    const rpmUnit: string = !!props.lastShot ? "RPM" : "";

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
                    className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.getCarry().toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2) : ""} </div>
                <div
                    className="last-shot-item__unit"> {distanceUnit} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Total</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.getTotalDistance().toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2) : ""} </div>
                <div
                    className="last-shot-item__unit"> {distanceUnit} </div>
            </div>
            <div className="last-shot__row">
                <div className="last-shot-item__label">Offline</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.getOffline().toNumber(props.selectedDrillConfiguration.getUnit()).toFixed(2) : ""} </div>
                <div
                    className="last-shot-item__unit"> {distanceUnit} </div>
            </div>
            {[trackmanScoreAndShotsGainedDrillType, targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                ? <>
                    <div className="last-shot__row">
                        <div className="last-shot-item__label">Absolute Deviation</div>
                        <div className="last-shot-item__data"> {absoluteDeviationInUnitAsString} </div>
                        <div
                            className="last-shot-item__unit"> {distanceUnit} </div>
                    </div>
                    <div className="last-shot__row">
                        <div className="last-shot-item__label">Relative Deviation</div>
                        <div className="last-shot-item__data"> {relativeDeviationInPercentAsString} </div>
                        <div className="last-shot-item__unit"> {!!props.lastShot ? `%` : ""} </div>
                    </div>
                </>
                : null}
            {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                ? <div className="last-shot__row">
                    <div className="last-shot-item__label">Target Total Spin</div>
                    <div
                        className="last-shot-item__data"> {!!props.lastShot ? (props.selectedDrillConfiguration.getTargetSpinInRpmPerUnit() * targetDistanceInUnitAsNumber).toFixed(0) : ""} </div>
                    <div
                        className="last-shot-item__unit"> {rpmUnit} </div>
                </div>
                : null}
            <div className="last-shot__row">
                <div className="last-shot-item__label">Total Spin</div>
                <div
                    className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.getTotalSpin().toFixed(0) : ""} </div>
                <div
                    className="last-shot-item__unit"> {rpmUnit} </div>
            </div>
            {[trackmanScoreAndShotsGainedDrillType, targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                ? <>
                    <div className="last-shot__row">
                        <div className="last-shot-item__label">Side Spin</div>
                        <div
                            className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.getSideSpin().toFixed(0) : ""} </div>
                        <div
                            className="last-shot-item__unit"> {rpmUnit} </div>
                    </div>
                    <div className="last-shot__row">
                        <div className="last-shot-item__label">Back Spin</div>
                        <div
                            className="last-shot-item__data"> {!!props.lastShot ? props.lastShot.getBackSpin().toFixed(0) : ""} </div>
                        <div
                            className="last-shot-item__unit"> {rpmUnit} </div>
                    </div>
                </>
                : null}
            {[trackmanScoreAndShotsGainedDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                ? <>
                    {shotsGainedData(props, targetDistanceString)}
                    {trackmanScoreData(props)}
                </>
                : null}
            {[spinDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                ? spinScoreData(props)
                : null}
            {[targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType())
                ? targetCircleScoreData(props)
                : null}

            {/* data for all shots */}
            {SHOW_ADDITIONAL_DATA_FOR_ALL_SHOTS ? additionalDataForAllShots(props) : null}
        </div>
    );
}
