import React from 'react';
import Chokidar, {FSWatcher} from 'chokidar';
import './MainPage.scss';
import {parseLastShotCsv} from "./LastShotCsvParser";
import {IDistancesGenerator} from "../../model/DistancesGenerator";
import {ShotsSvg} from "../../components/ShotsSvg/ShotsSvg";
import {computeAbsoluteDeviation, computeRelativeDeviation, IShotData} from "../../model/ShotData";
import {LastShotData} from "../../components/LastShotData/LastShotData";
import {assert} from "chai";

interface IMainPageProps {
    lastShotCsvPath: string;
    numberOfShots: number;
    distancesGenerators: IDistancesGenerator[];
}

export const MainPage: React.FC<IMainPageProps> = (props: IMainPageProps): JSX.Element => {
    assert(!!props, "!props");
    assert(props.distancesGenerators.length > 0, "props.distancesGenerators.length <= 0");

    const [selectedDistancesGenerator, setSelectedDistancesGenerator] =
        React.useState<IDistancesGenerator>(props.distancesGenerators[0]);

    const [shotData, setShotData] = React.useState<IShotData | undefined>();
    const [shotDatas, setShotDatas] = React.useState<IShotData[]>([]);

    const [nextDistance, setNextDistance] = React.useState<number>(selectedDistancesGenerator.getNext(shotDatas.length));
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
                    nextDistanceRef.current = selectedDistancesGenerator.getNext(shotDatasClone.length);
                } else {
                    console.log("all shots executed");
                    nextDistanceRef.current = undefined;
                }
                setNextDistance(nextDistanceRef.current);
            }
        }
    }, [shotData]);

    const restart = (): void => {
        setShotDatas([]);
        nextDistanceRef.current = selectedDistancesGenerator.getNext(0);
        setNextDistance(nextDistanceRef.current);
    }

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
        <div className="main-page__container">
            <div className="main-page__next-challenge-flex-item main-page__flex-item">
                <div className="main-page__header">
                    {!!nextDistance ?
                        <h3>Next</h3>
                        : <h3>Done</h3>}
                </div>
                {!!nextDistance
                    ? <div className="main-page__next-distance main-page__box">
                        <p className="main-page__next-distance-number">{nextDistance}</p>
                        <p className="main-page__next-distance-unit">Meter</p>
                    </div>
                    : <button className="main-page__restart main-page__box" onClick={(): void => {
                        restart();
                    }}>
                        Restart
                    </button>}
            </div>
            <div className="main-page__last-shot-flex-item main-page__flex-item">
                <div className="main-page__header">
                    <h3> Shot {shotDatas.length} / {props.numberOfShots} </h3>
                </div>
                <div className="main-page__last-shot-data">
                    <LastShotData
                        lastShot={lastShot}
                        absoluteDeviation={absoluteDeviation}
                        relativeDeviation={relativeDeviation}
                        absoluteDeviationSum={absoluteDeviationSum}
                        shotDatas={shotDatas}
                        relativeDeviationSum={relativeDeviationSum}
                    />
                </div>
            </div>
            <div className="main-page__shots-flex-item main-page__flex-item">
                <div className="main-page__header">
                    <h3>All Shots</h3>
                </div>
                <div className="main-page__shots_svg">
                    <ShotsSvg
                        svgNumberOfCircles={svgNumberOfCircles}
                        absoluteDeviationMax={absoluteDeviationMax}
                        svgScaleFactor={svgScaleFactor}
                        shotDatas={shotDatas}
                    />
                </div>
            </div>
        </div>
    );
}

