import React from "react";
import {IShotData} from "../../model/ShotData";
import './ShotsSvg.scss';

export const ShotsSvg = (svgNumberOfCircles: number, absoluteDeviationMax: number, svgScaleFactor: number, shotDatas: IShotData[]) => {
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
            Array.from({length: svgNumberOfCircles}, (_, i) => (absoluteDeviationMax / svgNumberOfCircles) * (i + 1)).map((factor) => {
                return <g key={`shots_svg_circle_${factor}`}>
                    <circle className="shots_svg_circle" r={factor * svgScaleFactor}/>
                    {/* x-axis positive */}
                    <text className="shots_svg_circletext"
                          x={factor * svgScaleFactor}
                          y={absoluteDeviationMax / svgNumberOfCircles + 3}
                    > {factor.toFixed(0)}
                    </text>
                    {/* x-axis negative */}
                    <text className="shots_svg_circletext"
                          x={-(factor * svgScaleFactor) - 1}
                          y={absoluteDeviationMax / svgNumberOfCircles + 3}
                    > {-factor.toFixed(0)}
                    </text>
                    {/* y-axis positive */}
                    <text className="shots_svg_circletext"
                          x={absoluteDeviationMax / svgNumberOfCircles + 3}
                          y={-(factor * svgScaleFactor)}
                    > {factor.toFixed(0)}
                    </text>
                    {/* y-axis negative */}
                    <text className="shots_svg_circletext"
                          x={absoluteDeviationMax / svgNumberOfCircles + 3}
                          y={factor * svgScaleFactor}
                    > {-factor.toFixed(0)}
                    </text>
                </g>
            })
        }

        {/*circle for current shot*/}
        {
            shotDatas.map((shotData: IShotData, index: number) => {
                return <g key={`shots_svg_shotcircle_${index}`}>
                    <circle
                        className={shotDatas.length === index + 1 ? 'shots_svg_lastshotcircle' : 'shots_svg_shotcircle'}
                        cx={shotData.offline * svgScaleFactor}
                        cy={(shotData.targetDistance - shotData.carry) * svgScaleFactor}/>
                    <text
                        className={shotDatas.length === index + 1 ? 'shots_svg_lastshotcircletext' : 'shots_svg_shotcircletext'}
                        x={shotData.offline * svgScaleFactor}
                        y={(shotData.targetDistance - shotData.carry) * svgScaleFactor}
                    > {index + 1}
                    </text>
                </g>
            })
        }
    </svg>;
}
