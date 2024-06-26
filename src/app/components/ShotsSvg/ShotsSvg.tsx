import React from "react";
import {assert} from "chai";
import {IShotData} from "../../model/ShotData/ShotData";
import './ShotsSvg.scss';
import {Unit} from "mathjs";
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import {computeAbsoluteDeviation} from "../../util/MathUtil";
import {
    asFewStrokesAsPossibleDrillType,
    spinDrillType,
    targetCircleDrillType
} from "../../model/SelectValues/DrillType";

const NUMBER_OF_CIRCLES: number = 5;

export interface IShotsSvg {
    shotDatas: IShotData[],
    selectedDrillConfiguration: IDrillConfiguration;
    nextDistance: Unit;
}

export const ShotsSvg: React.FC<IShotsSvg> = (props: IShotsSvg) => {
    assert(!!props, "!props");

    const absoluteDeviationMaxInUnitAsNumber: number =
        props.shotDatas
            .map((shotData: IShotData) => computeAbsoluteDeviation(shotData))
            .reduce((accumulator: number, absoluteDeviationAsUnit: Unit): number => {
                const absoluteDeviationInUnitAsNumber: number = absoluteDeviationAsUnit.toNumber(props.selectedDrillConfiguration.getUnit());
                return accumulator > absoluteDeviationInUnitAsNumber ? accumulator : absoluteDeviationInUnitAsNumber
            }, 0);
    const scaleFactor: number = (Math.floor(absoluteDeviationMaxInUnitAsNumber / NUMBER_OF_CIRCLES) + 1) * NUMBER_OF_CIRCLES;
    const svgScaleFactor: number = 100 / scaleFactor;
    const circleLabelPosition: number = scaleFactor / NUMBER_OF_CIRCLES;

    // target distance
    const latestShotTargetDistanceInUnitAsNumber: number =
        props.shotDatas.length > 0
            ? props.shotDatas[props.shotDatas.length - 1].getTargetDistance().toNumber(props.selectedDrillConfiguration.getUnit())
            : 0;
    const nextShotTargetDistanceInUnitAsNumber: number = props.nextDistance?.toNumber(props.selectedDrillConfiguration.getUnit());

    // deviation
    const latestShotMaxDeviationInUnitAsNumber: number =
        props.selectedDrillConfiguration.getMaxDeviationAsUnitNotPercent()
            ? props.selectedDrillConfiguration.getMaxDeviationInUnit()
            : props.selectedDrillConfiguration.getMaxDeviationInPercent() * latestShotTargetDistanceInUnitAsNumber / 100;
    const nextShotMaxDeviationInUnitAsNumber: number =
        props.selectedDrillConfiguration.getMaxDeviationAsUnitNotPercent()
            ? props.selectedDrillConfiguration.getMaxDeviationInUnit()
            : props.selectedDrillConfiguration.getMaxDeviationInPercent() * nextShotTargetDistanceInUnitAsNumber / 100;

    // target circle
    const latestShotTargetCircleRadiusScore100InUnitAsNumber: number =
        props.selectedDrillConfiguration.getTargetCircleRadiusAsUnitNotPercent()
            ? props.selectedDrillConfiguration.getTargetCircleRadiusScore100InUnit()
            : props.selectedDrillConfiguration.getTargetCircleRadiusScore100InPercent() * latestShotTargetDistanceInUnitAsNumber / 100;
    const latestShotTargetCircleRadiusScore0InUnitAsNumber: number =
        props.selectedDrillConfiguration.getTargetCircleRadiusAsUnitNotPercent()
            ? props.selectedDrillConfiguration.getTargetCircleRadiusScore0InUnit()
            : props.selectedDrillConfiguration.getTargetCircleRadiusScore0InPercent() * latestShotTargetDistanceInUnitAsNumber / 100;
    const nextShotTargetCircleRadiusScore100InUnitAsNumber: number =
        props.selectedDrillConfiguration.getTargetCircleRadiusAsUnitNotPercent()
            ? props.selectedDrillConfiguration.getTargetCircleRadiusScore100InUnit()
            : props.selectedDrillConfiguration.getTargetCircleRadiusScore100InPercent() * nextShotTargetDistanceInUnitAsNumber / 100;
    const nextShotTargetCircleRadiusScore0InUnitAsNumber: number =
        props.selectedDrillConfiguration.getTargetCircleRadiusAsUnitNotPercent()
            ? props.selectedDrillConfiguration.getTargetCircleRadiusScore0InUnit()
            : props.selectedDrillConfiguration.getTargetCircleRadiusScore0InPercent() * nextShotTargetDistanceInUnitAsNumber / 100;

    return (
        <svg width="100%" height="100%" viewBox="-110 -110.5 220.3 220.2"
             preserveAspectRatio="xMidYMid meet"
             xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" patternUnits="userSpaceOnUse" width="10" height="10" x="0" y="0">
                    <path d="M0,0 v10 h10" stroke="#57c4ff" fill="none"/>
                </pattern>
                <radialGradient id="TargetCircleRadialGradient100">
                    <stop offset="0" stopOpacity="1" stopColor="darkgoldenrod"/>
                    <stop offset="0.5" stopOpacity="0.8" stopColor="darkgoldenrod"/>
                    <stop offset="1" stopOpacity="0.4" stopColor="darkgoldenrod"/>
                </radialGradient>
                <radialGradient id="TargetCircleRadialGradient0">
                    <stop offset="0" stopOpacity="1" stopColor="gold"/>
                    <stop offset="0.4" stopOpacity="0.8" stopColor="gold"/>
                    <stop offset="0.9" stopOpacity="0.3" stopColor="gold"/>
                </radialGradient>
            </defs>

            {/* background grid*/}
            <rect x="-110" y="-110.4" width="220.3" height="220.4" fill="url(#grid)"></rect>

            {/*line for latestShotMaxDeviationInUnitAsNumber*/}
            {
                [spinDrillType].includes(props.selectedDrillConfiguration.getDrillType()) && props.shotDatas.length > 0 ?
                    <>
                        <path className="shots_svg_latestmaxdeviation"
                              d={`M-110,${-latestShotMaxDeviationInUnitAsNumber * svgScaleFactor} h220`}/>
                        <path className="shots_svg_latestmaxdeviation"
                              d={`M-110,${latestShotMaxDeviationInUnitAsNumber * svgScaleFactor} h220`}/>
                    </>
                    : null
            }

            {/*line for nextShotMaxDeviationInUnitAsNumber*/}
            {
                [spinDrillType].includes(props.selectedDrillConfiguration.getDrillType()) ?
                    <>
                        <path className="shots_svg_nextmaxdeviation"
                              d={`M-110,${-nextShotMaxDeviationInUnitAsNumber * svgScaleFactor} h220`}/>
                        <path className="shots_svg_nextmaxdeviation"
                              d={`M-110,${nextShotMaxDeviationInUnitAsNumber * svgScaleFactor} h220`}/>
                    </>
                    : null
            }

            {/*circle for latestShotTargetCircleRadiusScore0InUnitAsNumber*/}
            {
                [targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType()) ?
                    <circle className="shots_svg_latesttargetcircle_score0"
                            r={latestShotTargetCircleRadiusScore0InUnitAsNumber * svgScaleFactor}/>
                    : null
            }

            {/*circle for nextShotTargetCircleRadiusScore0InUnitAsNumber*/}
            {
                [targetCircleDrillType].includes(props.selectedDrillConfiguration.getDrillType()) ?
                    <circle className="shots_svg_nexttargetcircle_score0"
                            r={nextShotTargetCircleRadiusScore0InUnitAsNumber * svgScaleFactor}/>
                    : null
            }

            {/*circle for latestShotTargetCircleRadiusScore100InUnitAsNumber*/}
            {
                [targetCircleDrillType, asFewStrokesAsPossibleDrillType].includes(props.selectedDrillConfiguration.getDrillType()) ?
                    <circle className="shots_svg_latesttargetcircle_score100"
                            r={latestShotTargetCircleRadiusScore100InUnitAsNumber * svgScaleFactor}/>
                    : null
            }

            {/*circle for nextShotTargetCircleRadiusScore100InUnitAsNumber*/}
            {
                [targetCircleDrillType, asFewStrokesAsPossibleDrillType].includes(props.selectedDrillConfiguration.getDrillType()) ?
                    <circle className="shots_svg_nexttargetcircle_score100"
                            r={nextShotTargetCircleRadiusScore100InUnitAsNumber * svgScaleFactor}/>
                    : null
            }


            {/* x-, y-axis*/}
            <path className="shots_svg_axis" d="M0,-110 v220"/>
            <path className="shots_svg_axis" d="M-110,0 h220"/>

            {/* circles around 0,0 */}
            {
                Array.from({length: NUMBER_OF_CIRCLES}, (_, i: number) => (circleLabelPosition) * (i + 1)).map((factor: number) => {
                    return <g key={`shots_svg_circle_${factor}`}>
                        <circle className="shots_svg_circle" r={factor * svgScaleFactor}/>
                        {/* x-axis positive */}
                        <text className="shots_svg_circletext"
                              x={factor * svgScaleFactor}
                              y={circleLabelPosition + 3}
                        > {factor.toFixed(0)}
                        </text>
                        {/* x-axis negative */}
                        <text className="shots_svg_circletext"
                              x={-(factor * svgScaleFactor) - 1}
                              y={circleLabelPosition + 3}
                        > {-factor.toFixed(0)}
                        </text>
                        {/* y-axis positive */}
                        <text className="shots_svg_circletext"
                              x={circleLabelPosition + 3}
                              y={-(factor * svgScaleFactor)}
                        > {factor.toFixed(0)}
                        </text>
                        {/* y-axis negative */}
                        <text className="shots_svg_circletext"
                              x={circleLabelPosition + 3}
                              y={factor * svgScaleFactor}
                        > {-factor.toFixed(0)}
                        </text>
                    </g>
                })
            }

            {/*circle for current shot*/}
            {
                props.shotDatas.map((shotData: IShotData, index: number) => {
                    const deltaY: number = shotData.getTargetDistance().toNumber(props.selectedDrillConfiguration.getUnit()) - shotData.getCarry().toNumber(props.selectedDrillConfiguration.getUnit());
                    return <g key={`shots_svg_shotcircle_${index}`}>
                        <circle
                            className={props.shotDatas.length === index + 1 ? 'shots_svg_latestshotcircle' : 'shots_svg_shotcircle'}
                            cx={shotData.getOffline().toNumber(props.selectedDrillConfiguration.getUnit()) * svgScaleFactor}
                            cy={deltaY * svgScaleFactor}/>
                        <text
                            className={props.shotDatas.length === index + 1 ? 'shots_svg_latestshotcircletext' : 'shots_svg_shotcircletext'}
                            x={shotData.getOffline().toNumber(props.selectedDrillConfiguration.getUnit()) * svgScaleFactor}
                            y={deltaY * svgScaleFactor}
                        > {index + 1}
                        </text>
                    </g>
                })
            }
        </svg>);
}
