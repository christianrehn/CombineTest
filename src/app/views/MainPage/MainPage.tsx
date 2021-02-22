import React from 'react';
import Chokidar, {FSWatcher} from 'chokidar';
import './MainPage.scss';
import {assert} from 'chai';
import {parseLastShotCsv} from "./LastShotCsvParser";


/**
 * Create random number between [min, max[.
 */
function createRandomNumber(min: number, max: number): number {
    assert(min < max, "min >= max");

    return Math.floor(Math.random() * Math.floor(max - min)) + min;
}


interface IShotData {
    id: number,
    carry: number,
    offline: number,
    targetDistance: number,
}

interface IMainPageProps {
    lastShotCsvPath: string;
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
    const minDistance: number = 10;
    const maxDistance: number = 60;
    const [shotData, setShotData] = React.useState<IShotData | undefined>();
    const [shotDatas, setShotDatas] = React.useState<IShotData[]>([]);

    const [nextDistance, setNextDistance] = React.useState<number>(createRandomNumber(minDistance, maxDistance));
    const nextDistanceRef: React.MutableRefObject<number> = React.useRef<number>(nextDistance);

    const lastShotFileChanged = async (): Promise<void> => {
        const lastShotData: any = await parseLastShotCsv(props.lastShotCsvPath);
        const shotIdFromLastShotFile: number = lastShotData["shot_id"];
        if (!!shotIdFromLastShotFile) {
            if (shotDatas.length <= 0 || shotIdFromLastShotFile !== shotDatas[shotDatas.length].id) {
                console.log(`shot id=${shotIdFromLastShotFile} has been executed`);
                setShotData({
                    id: shotIdFromLastShotFile,
                    carry: lastShotData["carry_m"],
                    offline: lastShotData["offline_m"],
                    targetDistance: nextDistanceRef.current
                });
            }
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
        if (!!shotData) {
            // a new shot has been executes -> add it to array and create new distance for next shot
            const shotDatasClone: IShotData[] = [...shotDatas];
            shotDatasClone.push(shotData);
            setShotDatas(shotDatasClone);
            nextDistanceRef.current = createRandomNumber(minDistance, maxDistance);
            setNextDistance(nextDistanceRef.current);
        }
    }, [shotData]);

    const absoluteDeviation: number | undefined = shotDatas.length > 0 ? computeAbsoluteDeviation(shotDatas[shotDatas.length - 1]) : undefined;
    const relativeDeviation: number | undefined = shotDatas.length > 0 ? computeRelativeDeviation(shotDatas[shotDatas.length - 1]) : undefined;

    console.log("shotDatas", shotDatas);
    return (
        <div className="main-page">
            <div className="main-page__next-challenge">
                <div className="main-page__header">
                    <h3> Next Challenge </h3>
                </div>
                <div className="main-page__next-distance">
                    <p className="main-page__next-distance-number">{nextDistance}</p>
                    <p className="main-page__next-distance-unit">Meter</p>
                </div>
            </div>
            <div className="main-page__last-shot">
                <div className="main-page__header">
                    <h3> Last Shot </h3>
                </div>
                <table className="main-page__shot-data-holder">
                    <tbody>
                    <tr id="shotId" className="shot-item">
                        <td className="shot-item__label">Shot Id</td>
                        <td className="shot-item__data"> {shotDatas.length > 0 ? `${shotDatas[shotDatas.length - 1].id} / ${shotDatas.length}` : ""} </td>
                        <td className="shot-item__unit"></td>
                    </tr>
                    <tr id="carry" className="shot-item">
                        <td className="shot-item__label">Carry</td>
                        <td className="shot-item__data"> {shotDatas.length > 0 ? `${shotDatas[shotDatas.length - 1].carry.toFixed(2)}` : ""} </td>
                        <td className="shot-item__unit"> {shotDatas.length > 0 ? `Meter` : ""} </td>
                    </tr>
                    <tr id="offline" className="shot-item">
                        <td className="shot-item__label">Offline</td>
                        <td className="shot-item__data"> {shotDatas.length > 0 ? `${shotDatas[shotDatas.length - 1].offline.toFixed(2)}` : ""} </td>
                        <td className="shot-item__unit"> {shotDatas.length > 0 ? `Meter` : ""} </td>
                    </tr>
                    <tr id="targetDistance" className="shot-item">
                        <td className="shot-item__label">Soll Distanz</td>
                        <td className="shot-item__data"> {shotDatas.length > 0 ? `${shotDatas[shotDatas.length - 1].targetDistance}` : ""} </td>
                        <td className="shot-item__unit"> {shotDatas.length > 0 ? `Meter` : ""} </td>
                    </tr>
                    <tr id="absoluteDeviation" className="shot-item">
                        <td className="shot-item__label">Absolute Abweichung</td>
                        <td className="shot-item__data"> {
                            !!absoluteDeviation ? `${absoluteDeviation.toFixed(2)}` : ""
                        } </td>
                        <td className="shot-item__unit"> {shotDatas.length > 0 ? `Meter` : ""} </td>
                    </tr>
                    <tr id="relativeDeviation" className="shot-item">
                        <td className="shot-item__label">Relative Abweichung</td>
                        <td className="shot-item__data"> {
                            !!relativeDeviation ? `${relativeDeviation.toFixed(2)}` : ""
                        } </td>
                        <td className="shot-item__unit"> {shotDatas.length > 0 ? `Meter` : ""} </td>
                    </tr>
                    <tr id="absoluteDeviationSum" className="shot-item">
                        <td className="shot-item__label">Summe Absolute Abweichung</td>
                        <td className="shot-item__data"> {
                            shotDatas.length > 0 ? `${
                                shotDatas
                                    .map((shotData: IShotData) => computeAbsoluteDeviation(shotData))
                                    .reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0)
                                    .toFixed(2)}` : ""
                        } </td>
                        <td className="shot-item__unit"> {shotDatas.length > 0 ? `Meter` : ""} </td>
                    </tr>
                    <tr id="relativeDeviationSum" className="shot-item">
                        <td className="shot-item__label">Summe Relative Abweichung</td>
                        <td className="shot-item__data"> {
                            shotDatas.length > 0 ? `${
                                shotDatas
                                    .map((shotData: IShotData) => computeRelativeDeviation(shotData))
                                    .reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0)
                                    .toFixed(2)}` : ""
                        } </td>
                        <td className="shot-item__unit"> {shotDatas.length > 0 ? `Meter` : ""} </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

