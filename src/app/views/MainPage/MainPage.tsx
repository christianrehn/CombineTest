import React from 'react';
import Chokidar, {FSWatcher} from 'chokidar';
import './MainPage.scss';
import {assert} from 'chai';
import {parseLastShotCsv} from "@/app/views/MainPage/LastShotCsvParser";
import * as path from "path";


/**
 * Create random number between [min, max[.
 */
function createRandomNumber(min: number, max: number) {
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

export const MainPage: React.FC<IMainPageProps> = (props: IMainPageProps): JSX.Element => {
    const minDistance: number = 10;
    const maxDistance: number = 60;
    const [shotData, setShotData] = React.useState<IShotData | undefined>();
    const [nextDistance, setNextDistance] = React.useState<number>(createRandomNumber(minDistance, maxDistance));

    const lastShotFileChanged = async (targetDistance: number): Promise<void> => {
        const lastShotData: any = await parseLastShotCsv(props.lastShotCsvPath);
        const shotIdFromLastShotFile: number = lastShotData["shot_id"];
        if (shotIdFromLastShotFile !== shotData?.id) {
            console.log("next shot has been executed");
            setShotData({
                id: shotIdFromLastShotFile,
                carry: lastShotData["carry_m"],
                offline: lastShotData["offline_m"],
                targetDistance
            });
            setNextDistance(createRandomNumber(minDistance, maxDistance));
        }
    }

    const [watcher, setWatcher] = React.useState<FSWatcher | undefined>();
    React.useEffect((): void => {
        console.log("startWatcher");
        setWatcher(Chokidar.watch(
            props.lastShotCsvPath,
            {
                ignored: /[\/\\]\./,
                persistent: true
            }));
    }, [props.lastShotCsvPath])

    if (!!watcher) {
        (watcher as FSWatcher)
            .on('add', function (path: string): void {
                console.log('File', path, 'has been added');
                lastShotFileChanged(nextDistance);
            })
            .on('addDir', function (path: string): void {
                console.log('Directory', path, 'has been added');
            })
            .on('change', async (path: string): Promise<void> => {
                console.log('File', path, 'has been changed');
                lastShotFileChanged(nextDistance);
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
    }

    const deltaDistance: number | undefined = !!shotData ? shotData.carry - shotData.targetDistance : undefined;
    const absoluteDeviation: number | undefined = !!shotData && !!deltaDistance
        ? Math.sqrt(deltaDistance * deltaDistance + shotData.offline * shotData.offline)
        : undefined;
    const relativeDeviation: number | undefined = !!shotData && !!absoluteDeviation
        ? absoluteDeviation / shotData.targetDistance
        : undefined;

    return (
        <div className="main-page">
            <div className="main-page-next-challenge"
                 style={{
                     float: "left",
                     width: 500,
                     minWidth: 300,
                     height: "100%",
                     paddingTop: 20,
                 }}>
                <div className="main-page__header">
                    <h3> Next Challenge </h3>
                </div>
                <div style={{
                    marginTop: 100,
                    backgroundColor: "white",
                    color: "#234050",
                    textAlign: "center",
                    width: "70%",
                    paddingTop: 50,
                    paddingBottom: 50,
                    display: "inline-block"
                }}>
                    <p style={{fontSize: 120,}}>{nextDistance}</p>
                    <p style={{fontSize: 60,}}>Meter</p>
                </div>
            </div>
            <div className="main-page-last-shot"
                 style={{
                     float: "left",
                     minWidth: 700,
                     height: "100%",
                     borderColor: "white",
                     borderStyle: "solid",
                     borderLeftWidth: 5,
                     paddingTop: 20
                 }}>
                <div className="main-page__header">
                    <h3> Last Shot </h3>
                </div>
                <table className="shot-data-holder">
                    <tr className="shot-item">
                        <td className="shot-item__label">Shot Id</td>
                        <td className="shot-item__data"> {shotData?.id} </td>
                    </tr>
                    <tr className="shot-item">
                        <td className="shot-item__label">Carry</td>
                        <td className="shot-item__data"> {!!shotData ? `${shotData.carry.toFixed(2)} Meter` : ""} </td>
                    </tr>
                    <tr className="shot-item">
                        <td className="shot-item__label">Offline</td>
                        <td className="shot-item__data"> {!!shotData ? `${shotData.offline.toFixed(2)} Meter` : ""} </td>
                    </tr>
                    <tr className="shot-item">
                        <td className="shot-item__label">Soll Distanz</td>
                        <td className="shot-item__data"> {!!shotData ? `${shotData.targetDistance} Meter` : ""} </td>
                    </tr>
                    <tr className="shot-item">
                        <td className="shot-item__label">Absolute Abweichung</td>
                        <td className="shot-item__data"> {
                            !!absoluteDeviation ? `${absoluteDeviation.toFixed(2)} Meter` : ""
                        } </td>
                    </tr>
                    <tr className="shot-item">
                        <td className="shot-item__label">Relative Abweichung</td>
                        <td className="shot-item__data"> {
                            !!relativeDeviation ? `${relativeDeviation.toFixed(2)} Meter` : ""
                        } </td>
                    </tr>
                </table>
            </div>
        </div>
    );
}

