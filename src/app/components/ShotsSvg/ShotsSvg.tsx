import React from "react";
import {IShotData} from "../../model/ShotData";
import './ShotsSvg.scss';

export interface IShotsSvg {
    svgNumberOfCircles: number,
    absoluteDeviationMax: number,
    svgScaleFactor: number,
    shotDatas: IShotData[]
}

export const ShotsSvg: React.FC<IShotsSvg> = (props: IShotsSvg) => {
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
            Array.from({length: props.svgNumberOfCircles}, (_, i) => (props.absoluteDeviationMax / props.svgNumberOfCircles) * (i + 1)).map((factor) => {
                return <g key={`shots_svg_circle_${factor}`}>
                    <circle className="shots_svg_circle" r={factor * props.svgScaleFactor}/>
                    {/* x-axis positive */}
                    <text className="shots_svg_circletext"
                          x={factor * props.svgScaleFactor}
                          y={props.absoluteDeviationMax / props.svgNumberOfCircles + 3}
                    > {factor.toFixed(0)}
                    </text>
                    {/* x-axis negative */}
                    <text className="shots_svg_circletext"
                          x={-(factor * props.svgScaleFactor) - 1}
                          y={props.absoluteDeviationMax / props.svgNumberOfCircles + 3}
                    > {-factor.toFixed(0)}
                    </text>
                    {/* y-axis positive */}
                    <text className="shots_svg_circletext"
                          x={props.absoluteDeviationMax / props.svgNumberOfCircles + 3}
                          y={-(factor * props.svgScaleFactor)}
                    > {factor.toFixed(0)}
                    </text>
                    {/* y-axis negative */}
                    <text className="shots_svg_circletext"
                          x={props.absoluteDeviationMax / props.svgNumberOfCircles + 3}
                          y={factor * props.svgScaleFactor}
                    > {-factor.toFixed(0)}
                    </text>
                </g>
            })
        }

        {/*circle for current shot*/}
        {
            props.shotDatas.map((shotData: IShotData, index: number) => {
                return <g key={`shots_svg_shotcircle_${index}`}>
                    <circle
                        className={props.shotDatas.length === index + 1 ? 'shots_svg_lastshotcircle' : 'shots_svg_shotcircle'}
                        cx={shotData.offline * props.svgScaleFactor}
                        cy={(shotData.targetDistance - shotData.carry) * props.svgScaleFactor}/>
                    <text
                        className={props.shotDatas.length === index + 1 ? 'shots_svg_lastshotcircletext' : 'shots_svg_shotcircletext'}
                        x={shotData.offline * props.svgScaleFactor}
                        y={(shotData.targetDistance - shotData.carry) * props.svgScaleFactor}
                    > {index + 1}
                    </text>
                </g>
            })
        }
    </svg>;
}
