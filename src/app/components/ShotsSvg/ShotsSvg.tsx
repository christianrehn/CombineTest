import React from "react";
import {assert} from "chai";
import {computeAbsoluteDeviation, IShotData} from "../../model/ShotData";
import './ShotsSvg.scss';
import {Unit} from "mathjs";
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";

export interface IShotsSvg {
    svgNumberOfCircles: number,
    shotDatas: IShotData[],
    selectedDrillConfiguration: IDrillConfiguration;
}

export const ShotsSvg: React.FC<IShotsSvg> = (props: IShotsSvg) => {
    assert(!!props, "!props");

    const absoluteDeviationMaxAsNumber: number =
        props.shotDatas
            .map((shotData: IShotData) => computeAbsoluteDeviation(shotData))
            .reduce((accumulator: number, absoluteDeviation: Unit) => {
                const absoluteDeviationAsNumber: number = absoluteDeviation.toNumber(props.selectedDrillConfiguration.getUnit());
                return accumulator > absoluteDeviationAsNumber ? accumulator : absoluteDeviationAsNumber
            }, 0);
    console.log("absoluteDeviationMaxAsNumber", absoluteDeviationMaxAsNumber);
    console.log("props.svgNumberOfCircles", props.svgNumberOfCircles)

    const scaleFactor: number = (Math.floor(absoluteDeviationMaxAsNumber / props.svgNumberOfCircles) + 1) * props.svgNumberOfCircles;
    console.log("scaleFactor", scaleFactor);
    const svgScaleFactor: number = 100 / scaleFactor;
    const circleLabelPosition: number = scaleFactor / props.svgNumberOfCircles;

    return <svg width="100%" height="100%" viewBox="-110 -110.5 220.3 220.2"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="grid" patternUnits="userSpaceOnUse" width="10" height="10" x="0" y="0">
                <path d="M0,0 v10 h10" stroke="#57c4ff" fill="none"/>
            </pattern>
        </defs>
        {/* background grid*/}
        <rect x="-110" y="-110.4" width="220.3" height="220.4" fill="url(#grid)"></rect>

        {/* x-, y-axis*/}
        <path className="shots_svg_axis" d="M0,-110 v220"/>
        <path className="shots_svg_axis" d="M-110,0 h220"/>

        {/* circles around 0,0 */}
        {
            Array.from({length: props.svgNumberOfCircles}, (_, i) => (circleLabelPosition) * (i + 1)).map((factor) => {
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
                const deltaY: number = shotData.targetDistance.toNumber(props.selectedDrillConfiguration.getUnit()) - shotData.carry.toNumber(props.selectedDrillConfiguration.getUnit());
                return <g key={`shots_svg_shotcircle_${index}`}>
                    <circle
                        className={props.shotDatas.length === index + 1 ? 'shots_svg_lastshotcircle' : 'shots_svg_shotcircle'}
                        cx={shotData.offline.toNumber(props.selectedDrillConfiguration.getUnit()) * svgScaleFactor}
                        cy={deltaY * svgScaleFactor}/>
                    <text
                        className={props.shotDatas.length === index + 1 ? 'shots_svg_lastshotcircletext' : 'shots_svg_shotcircletext'}
                        x={shotData.offline.toNumber(props.selectedDrillConfiguration.getUnit()) * svgScaleFactor}
                        y={deltaY * svgScaleFactor}
                    > {index + 1}
                    </text>
                </g>
            })
        }
    </svg>;
}
