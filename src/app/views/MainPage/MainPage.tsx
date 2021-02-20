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

interface IMainPage {
    lastShotCsvPath: string;
}

export const MainPage: React.FC<IMainPage> = (props: IMainPage): JSX.Element => {
    const minDistance: number = 10;
    const maxDistance: number = 60;
    const [shotId, setShotId] = React.useState<number | undefined>(undefined);
    const [shotCarry, setShotCarry] = React.useState<number | undefined>(undefined);
    const [shotOffline, setShotOffline] = React.useState<number | undefined>(undefined);
    const [shotTargetDistance, setShotTargetDistance] = React.useState<number | undefined>();
    const [nextDistance, setNextDistance] = React.useState<number>(createRandomNumber(minDistance, maxDistance));

    const lastShotFileChanged = (): void => {
        parseLastShotCsv(props.lastShotCsvPath).then((lastShotData: any): boolean => {
            console.log("lastShotData", lastShotData);
            const shotIdFromLastShotFile: number = lastShotData["shot_id"];
            if (shotIdFromLastShotFile !== shotId) {
                console.log("next shot has been executed");
                setShotId(shotIdFromLastShotFile);
                setShotCarry(lastShotData["carry_m"]);
                setShotOffline(lastShotData["offline_m"]);
                return true;
            }
            return false;
        });
    }
    console.log("nextDistance", nextDistance)
    console.log("shotTargetDistance", shotTargetDistance)

    const startWatcher = (path: string): void => {
        console.log("startWatcher");
        const watcher: FSWatcher = Chokidar.watch(
            path,
            {
                ignored: /[\/\\]\./,
                persistent: true
            });

        watcher
            .on('add', function (path: string): void {
                console.log('File', path, 'has been added');
                lastShotFileChanged();
            })
            .on('addDir', function (path: string): void {
                console.log('Directory', path, 'has been added');
            })
            .on('change', function (path: string): void {
                console.log('File', path, 'has been changed');
                lastShotFileChanged();
                setShotTargetDistance(nextDistance);
                console.log("nextDistanceXXX", nextDistance)
                setNextDistance(createRandomNumber(minDistance, maxDistance));
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

    React.useEffect(() => {
        startWatcher(props.lastShotCsvPath);
    }, [props.lastShotCsvPath])

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
                        <td className="shot-item__data"> {shotId} </td>
                    </tr>
                    <tr className="shot-item">
                        <td className="shot-item__label">Carry Meter</td>
                        <td className="shot-item__data"> {shotCarry?.toFixed(2)} </td>
                    </tr>
                    <tr className="shot-item">
                        <td className="shot-item__label">Ziel</td>
                        <td className="shot-item__data"> {shotTargetDistance} </td>
                    </tr>
                    <tr className="shot-item">
                        <td className="shot-item__label">Offline Meter</td>
                        <td className="shot-item__data"> {shotOffline?.toFixed(2)} </td>
                    </tr>
                    <tr className="shot-item">
                        <td className="shot-item__label">Abstand zum Ziel</td>
                        <td className="shot-item__data"> {
                            !!shotCarry && !!shotOffline && !!shotTargetDistance ?
                                (Math.sqrt((shotCarry - shotTargetDistance) * (shotCarry - shotTargetDistance) + shotOffline * shotOffline)).toFixed(2)
                                : ""
                        } </td>
                    </tr>
                </table>
            </div>
        </div>
    );
}

