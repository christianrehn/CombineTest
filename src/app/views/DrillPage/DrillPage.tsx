import React from 'react';
import Chokidar, {FSWatcher} from 'chokidar';
import './DrillPage.scss';
import {parseCsvToFirstRowAsObject} from "../../util/CsvParser";
import {IDrillConfiguration} from "../../model/DrillConfiguration";
import {ShotsSvg} from "../../components/ShotsSvg/ShotsSvg";
import {IShotData} from "../../model/ShotData";
import {LastShotData} from "../../components/LastShotData/LastShotData";
import {assert} from "chai";
import {NextDistanceBox} from "../../components/NextDistanceBox/NextDistanceBox";
import exitIcon from '../../../assets/exit.png';
import {RestartButton} from "../../components/RestartButton/RestartButton";
import * as math from 'mathjs'
import {Unit} from 'mathjs'
import {SelectDrillPageName} from "../SelectDrillPage/SelectDrillPage";

export const DrillPageName: string = "DrillPage";

interface IDrillPageProps {
    lastShotCsvPath: string;
    selectedDrillConfiguration: IDrillConfiguration;
    handleSelectPageClicked: (page: string) => void;
}

export const DrillPage: React.FC<IDrillPageProps> = (props: IDrillPageProps): JSX.Element => {
    assert(!!props, "!props");
    assert(!!props.handleSelectPageClicked, "!props.handleSettingsClicked");

    if (!props.selectedDrillConfiguration) {
        // configurartion has not yet been read
        return null;
    }

    const [shotData, setShotData] = React.useState<IShotData | undefined>();
    const [shotDatas, setShotDatas] = React.useState<IShotData[]>([]);

    const [nextDistance, setNextDistance] = React.useState<Unit>(props.selectedDrillConfiguration.getNextDistance(shotDatas.length));
    const nextDistanceRef: React.MutableRefObject<Unit> = React.useRef<Unit>(nextDistance);

    const lastShotFileChanged = async (): Promise<void> => {
        const lastShotData: any = await parseCsvToFirstRowAsObject(props.lastShotCsvPath);
        const shotIdFromLastShotFile: number = lastShotData["shot_id"];
        if (!!shotIdFromLastShotFile) {
            console.log(`shot id=${shotIdFromLastShotFile} has been executed`);
            setShotData({
                id: shotIdFromLastShotFile,
                carry: math.unit(lastShotData["carry_m"], "m"),
                totalDistance: math.unit(lastShotData["total_distance_m"], "m"),
                offline: math.unit(lastShotData["offline_m"], "m"),
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
                console.log('Raw event info:', event, path, details);
            });

    }, [props.lastShotCsvPath])

    React.useEffect((): void => {
        if (!!shotData && (shotDatas.length === 0 || shotData.id !== shotDatas[shotDatas.length - 1].id)) {
            // new shot detected

            if (shotDatas.length >= props.selectedDrillConfiguration.numberOfShots) {
                // shot executed but number of shots was already reached -> ignore
                console.log(`shot id=${shotData.id} executed but number of shots was already reached -> ignore`);
            } else {
                // add new shot to array
                const shotDatasClone: IShotData[] = [...shotDatas];
                shotDatasClone.push(shotData);
                setShotDatas(shotDatasClone);

                // pick new distance for next shot
                if (shotDatasClone.length < props.selectedDrillConfiguration.numberOfShots) {
                    nextDistanceRef.current = props.selectedDrillConfiguration.getNextDistance(shotDatasClone.length);
                } else {
                    console.log("all shots executed");
                    nextDistanceRef.current = undefined;
                }
                setNextDistance(nextDistanceRef.current);
            }
        }
    }, [shotData]);

    const restart = (): void => {
        props.selectedDrillConfiguration.reset();
        setShotDatas([]);
        nextDistanceRef.current = (props.selectedDrillConfiguration).getNextDistance(0);
        setNextDistance(nextDistanceRef.current);
    }

    const lastShot: IShotData | undefined = shotDatas.length > 0 ? shotDatas[shotDatas.length - 1] : undefined;
    const svgNumberOfCircles: number = 5;

    console.log("shotDatas", shotDatas)

    return (
        <div className="drill-page page">
            <div className="next-shot-flex-item flex-item">
                <div className="page-header">
                    <h3>Carry</h3>
                </div>
                <div className="NextDistanceBox">
                    <NextDistanceBox
                        nextDistance={nextDistance}
                        selectedDrillConfiguration={props.selectedDrillConfiguration}
                    />
                </div>
                <div className="RestartButton">
                    <RestartButton
                        handleRestartButtonClicked={restart}
                    />
                </div>
            </div>
            <div className="last-shot-flex-item flex-item">
                <div className="page-header">
                    <h3> Shot {shotDatas.length} / {props.selectedDrillConfiguration.numberOfShots} </h3>
                </div>
                <div className="LastShotData">
                    <LastShotData
                        lastShot={lastShot}
                        shotDatas={shotDatas}
                        selectedDrillConfiguration={props.selectedDrillConfiguration}
                    />
                </div>
            </div>
            <div className="shots-flex-item flex-item">
                <div className="page-header">
                    <h3>All Shots</h3>
                </div>
                <div className="ShotsSvg">
                    <ShotsSvg
                        svgNumberOfCircles={svgNumberOfCircles}
                        shotDatas={shotDatas}
                        selectedDrillConfiguration={props.selectedDrillConfiguration}
                    />
                </div>
            </div>
            <div className="page-change-flex-item flex-item">
                <span className="page-change-span"
                      onClick={(): void => {
                          props.handleSelectPageClicked(SelectDrillPageName)
                      }}>
                    <img className="page-change-img"
                         src={exitIcon}
                         alt="Exit"
                    />
            </span>
            </div>
        </div>
    );
}
