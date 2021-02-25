import React from 'react';
import Chokidar, {FSWatcher} from 'chokidar';
import './MainPage.scss';
import {assert} from 'chai';
import {parseLastShotCsv} from "./LastShotCsvParser";
import {IDistances} from "../../util/Distances";


interface IShotData {
    id: number,
    carry: number,
    offline: number,
    targetDistance: number,
}

interface IMainPageProps {
    lastShotCsvPath: string;
    numberOfShots: number;
    distances: IDistances;
}

const computeAbsoluteDeviation = (shotData: IShotData): number => {
    assert(!!shotData, "!shotData");

    const deltaDistance: number = shotData.carry - shotData.targetDistance;
    const absoluteDeviation: number = Math.sqrt(deltaDistance * deltaDistance + shotData.offline * shotData.offline);
    return absoluteDeviation;
}

const computeRelativeDeviation = (shotData: IShotData): number => {
    assert(!!shotData, "!shotData");

    const absoluteDeviation: number = computeAbsoluteDeviation(shotData);
    const relativeDeviation: number = absoluteDeviation / shotData.targetDistance;
    return relativeDeviation;
}

export const MainPage: React.FC<IMainPageProps> = (props: IMainPageProps): JSX.Element => {

    const [shotData, setShotData] = React.useState<IShotData | undefined>();
    const [shotDatas, setShotDatas] = React.useState<IShotData[]>([]);

    const [nextDistance, setNextDistance] = React.useState<number>(props.distances.getNext(shotDatas.length));
    const nextDistanceRef: React.MutableRefObject<number> = React.useRef<number>(nextDistance);

    const lastShotFileChanged = async (): Promise<void> => {
        const lastShotData: any = await parseLastShotCsv(props.lastShotCsvPath);
        const shotIdFromLastShotFile: number = lastShotData["shot_id"];
        if (!!shotIdFromLastShotFile) {
            console.log(`shot id=${shotIdFromLastShotFile} has been executed`);
            setShotData({
                id: shotIdFromLastShotFile,
                carry: lastShotData["carry_m"],
                offline: lastShotData["offline_m"],
                targetDistance: nextDistanceRef.current
            });
        }
    }

    React.useEffect((): void => {
        console.log("startWatcher");
        const watcher: FSWatcher = Chokidar.watch(
            props.lastShotCsvPath,
            {
                ignored: /[\/\\]\./,
                ignoreInitial: true,
                persistent: true
            });
        watcher
            .on('add', (path: string): void => {
                console.log('File', path, 'has been added');
                lastShotFileChanged();
            })
            .on('addDir', (path: string): void => {
                console.log('Directory', path, 'has been added');
            })
            .on('change', (path: string): void => {
                console.log('File', path, 'has been changed');
                lastShotFileChanged();
            })
            .on('unlink', function (path: string): void {
                console.log('File', path, 'has been removed');
            })
            .on('unlinkDir', function (path: string): void {
                console.log('Directory', path, 'has been removed');
            })
            .on('error', function (error: Error): void {
                console.log('Error happened', error);
            })
            .on('ready', (): void => {
                console.info('From here can you check for real changes, the initial scan has been completed.');
            })
            .on('raw', function (event: string, path: string, details: any): void {
                // This event should be triggered everytime something happens.
                // console.log('Raw event info:', event, path, details);
            });

    }, [props.lastShotCsvPath])

    React.useEffect((): void => {
        console.log("useEffect triggered by shotData change");

        if (!!shotData && (shotDatas.length === 0 || shotData.id !== shotDatas[shotDatas.length - 1].id)) {
            // new shot detected

            if (shotDatas.length >= props.numberOfShots) {
                // shot executed but number of shots was already reached -> ignore
                console.log(`shot id=${shotData.id} executed but number of shots was already reached -> ignore`);
            } else {
                // add new shot to array
                const shotDatasClone: IShotData[] = [...shotDatas];
                shotDatasClone.push(shotData);
                setShotDatas(shotDatasClone);

                // pick new distance for next shot
                if (shotDatasClone.length < props.numberOfShots) {
                    nextDistanceRef.current = props.distances.getNext(shotDatasClone.length);
                } else {
                    console.log("all shots executed");
                    nextDistanceRef.current = undefined;
                }
                setNextDistance(nextDistanceRef.current);
            }
        }
    }, [shotData]);

    const absoluteDeviation: number | undefined = shotDatas.length > 0 ? computeAbsoluteDeviation(shotDatas[shotDatas.length - 1]) : undefined;
    const relativeDeviation: number | undefined = shotDatas.length > 0 ? computeRelativeDeviation(shotDatas[shotDatas.length - 1]) : undefined;

    const absoluteDeviationSum: number = shotDatas
        .map((shotData: IShotData) => computeAbsoluteDeviation(shotData))
        .reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
    const absoluteDeviationMax: number = shotDatas
        .map((shotData: IShotData) => computeAbsoluteDeviation(shotData))
        .reduce((accumulator: number, currentValue: number) => accumulator > currentValue ? accumulator : currentValue, 0) || 10;
    const relativeDeviationSum: number = shotDatas
        .map((shotData: IShotData) => computeRelativeDeviation(shotData))
        .reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) * 100;

    const lastShot: IShotData | undefined = shotDatas.length > 0 ? shotDatas[shotDatas.length - 1] : undefined;
    const svgScaleFactor: number = !!absoluteDeviationMax ? 100 / absoluteDeviationMax : 10;
    const svgNumberOfCircles: number = 6;

    console.log("shotDatas", shotDatas)
    return (
        <div className="main-page">
            <div id="main-page__next-challenge" className="main-page__next-challenge">
                <div className="main-page__header">
                    {!!nextDistance ?
                        <h3> Next Challenge </h3>
                        : <h3> Done </h3>}
                </div>
                {!!nextDistance
                    ? <div className="main-page__next-distance">
                        <p className="main-page__next-distance-number">{nextDistance}</p>
                        <p className="main-page__next-distance-unit">Meter</p>
                    </div>
                    : <button className="main-page__restart" onClick={() => {
                        console.log("restart");
                        setShotDatas([]);
                        nextDistanceRef.current = props.distances.getNext(0);
                        setNextDistance(nextDistanceRef.current);
                    }}>
                        Restart
                    </button>}
            </div>
            <div id="main-page__last-shot" className="main-page__last-shot">
                <div className="main-page__header">
                    <h3> Shot {shotDatas.length} / {props.numberOfShots} </h3>
                </div>
                <table className="main-page__shot-data-holder">
                    <tbody>
                    <tr id="targetDistance" className="shot-item">
                        <td className="shot-item__label">Soll Distanz</td>
                        <td className="shot-item__data"> {!!lastShot ? `${lastShot.targetDistance}` : ""} </td>
                        <td className="shot-item__unit"> {!!lastShot ? `Meter` : ""} </td>
                    </tr>
                    <tr id="carry" className="shot-item">
                        <td className="shot-item__label">Carry</td>
                        <td className="shot-item__data"> {!!lastShot ? `${lastShot.carry.toFixed(2)}` : ""} </td>
                        <td className="shot-item__unit"> {!!lastShot ? `Meter` : ""} </td>
                    </tr>
                    <tr id="offline" className="shot-item">
                        <td className="shot-item__label">Offline</td>
                        <td className="shot-item__data"> {!!lastShot ? `${lastShot.offline.toFixed(2)}` : ""} </td>
                        <td className="shot-item__unit"> {!!lastShot ? `Meter` : ""} </td>
                    </tr>
                    <tr id="absoluteDeviation" className="shot-item">
                        <td className="shot-item__label">Absolute Abweichung</td>
                        <td className="shot-item__data"> {
                            !!absoluteDeviation ? `${absoluteDeviation.toFixed(2)}` : ""
                        } </td>
                        <td className="shot-item__unit"> {!!lastShot ? `Meter` : ""} </td>
                    </tr>
                    <tr id="relativeDeviation" className="shot-item">
                        <td className="shot-item__label">Relative Abweichung</td>
                        <td className="shot-item__data"> {
                            !!relativeDeviation ? `${(relativeDeviation * 100).toFixed(1)}` : ""
                        } </td>
                        <td className="shot-item__unit"> {!!lastShot ? `%` : ""} </td>
                    </tr>
                    <tr id="absoluteDeviationSum" className="shot-item">
                        <td className="shot-item__label">Summe Absolute Abweichungen</td>
                        <td className="shot-item__data"> {
                            !!lastShot ? `${absoluteDeviationSum.toFixed(2)}` : ""
                        } </td>
                        <td className="shot-item__unit"> {!!lastShot ? `Meter` : ""} </td>
                    </tr>
                    <tr id="absoluteDeviationAvg" className="shot-item">
                        <td className="shot-item__label">Durchschnitt Absolute Abweichungen</td>
                        <td className="shot-item__data"> {
                            !!lastShot ? `${(absoluteDeviationSum / shotDatas.length).toFixed(2)}` : ""
                        } </td>
                        <td className="shot-item__unit"> {!!lastShot ? `Meter` : ""} </td>
                    </tr>
                    <tr id="relativeDeviationSum" className="shot-item">
                        <td className="shot-item__label">Summe Relative Abweichungen</td>
                        <td className="shot-item__data"> {
                            !!lastShot ? `${relativeDeviationSum.toFixed(1)}` : ""
                        } </td>
                        <td className="shot-item__unit"> {!!lastShot ? `%` : ""} </td>
                    </tr>
                    <tr id="relativeDeviationAvg" className="shot-item">
                        <td className="shot-item__label">Durchschnitt Relative Abweichungen</td>
                        <td className="shot-item__data"> {
                            !!lastShot ? `${(relativeDeviationSum / shotDatas.length).toFixed(1)}` : ""
                        } </td>
                        <td className="shot-item__unit"> {!!lastShot ? `%` : ""} </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div id="main-page__svg" className="main-page__shots">
                <div className="main-page__header">
                    <h3>All Shots</h3>
                </div>
                <div className="main-page__svg">
                    <svg width="100%" height="100%" viewBox="-110 -110.5 220.3 220.2"
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
                        <path className="main-page__svg_axis" d="M0,-110 v220"/>
                        <path className="main-page__svg_axis" d="M-110,0 h220"/>

                        {/* circles around 0,0 */}
                        {
                            Array.from({length: svgNumberOfCircles}, (_, i) => (absoluteDeviationMax / svgNumberOfCircles) * (i + 1)).map((factor) => {
                                return <g key={`main-page__svg_circle_${factor}`}>
                                    <circle className="main-page__svg_circle" r={factor * svgScaleFactor}/>
                                    {/* x-axis positive */}
                                    <text className="main-page__svg_circletext"
                                          x={factor * svgScaleFactor}
                                          y={absoluteDeviationMax / svgNumberOfCircles}
                                    > {factor.toFixed(0)}
                                    </text>
                                    {/* x-axis negative */}
                                    <text className="main-page__svg_circletext"
                                          x={-(factor * svgScaleFactor) - 1}
                                          y={absoluteDeviationMax / svgNumberOfCircles}
                                    > {-factor.toFixed(0)}
                                    </text>
                                    {/* y-axis positive */}
                                    <text className="main-page__svg_circletext"
                                          x={absoluteDeviationMax / svgNumberOfCircles}
                                          y={-(factor * svgScaleFactor)}
                                    > {factor.toFixed(0)}
                                    </text>
                                    {/* y-axis negative */}
                                    <text className="main-page__svg_circletext"
                                          x={absoluteDeviationMax / svgNumberOfCircles}
                                          y={factor * svgScaleFactor}
                                    > {-factor.toFixed(0)}
                                    </text>
                                </g>
                            })
                        }

                        {/*circle for current shot*/}
                        {
                            shotDatas.map((shotData: IShotData, index: number) => {
                                return <g key={`main-page__svg_shotcircle_${index}`}>
                                    <circle
                                        className={shotDatas.length === index + 1 ? 'main-page__svg_lastshotcircle' : 'main-page__svg_shotcircle'}
                                        cx={shotData.offline * svgScaleFactor}
                                        cy={(shotData.targetDistance - shotData.carry) * svgScaleFactor}/>
                                    <text
                                        className={shotDatas.length === index + 1 ? 'main-page__svg_lastshotcircletext' : 'main-page__svg_shotcircletext'}
                                        x={shotData.offline * svgScaleFactor}
                                        y={(shotData.targetDistance - shotData.carry) * svgScaleFactor}
                                    > {index + 1}
                                    </text>
                                </g>
                            })
                        }
                    </svg>
                </div>
            </div>
        </div>
    );
}

