import React from 'react';
import Chokidar, {FSWatcher} from 'chokidar';
import './DrillPage.scss';
import {parseCsvToFirstRowAsObject} from "../../util/CsvParser";
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import {ShotsSvg} from "../../components/ShotsSvg/ShotsSvg";
import {IShotData} from "../../model/ShotData";
import {LastShotData} from "../../components/LastShotData/LastShotData";
import {assert} from "chai";
import {NextDistanceBox} from "../../components/NextDistanceBox/NextDistanceBox";
import backIcon from '../../../assets/back.png';
import {RestartButton} from "../../components/RestartButton/RestartButton";
import * as math from 'mathjs'
import {Unit} from 'mathjs'
import {SelectDrillPageName} from "../SelectDrillPage/SelectDrillPage";
import {AllShotsTable} from "../../components/AllShotsTable/AllShotsTable";
import {ISession} from "../../model/Session/Session";

export const DrillPageName: string = "DrillPage";

interface IDrillPageProps {
    lastShotCsvPath: string;
    selectedDrillConfiguration: IDrillConfiguration;
    handleSelectPageClicked: (page: string) => void;
    handleSaveSessions: (session: ISession) => void;
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
            console.log(`shot id=${shotIdFromLastShotFile} has been executed, lastShotData: ${JSON.stringify(lastShotData)}`);
            setShotData({
                id: shotIdFromLastShotFile,
                club: lastShotData["club"],
                clubHeadSpeed: math.unit(lastShotData["club_head_speed_ms"], "m"),
                carry: math.unit(lastShotData["carry_m"], "m"),
                totalDistance: math.unit(lastShotData["total_distance_m"], "m"),
                offline: math.unit(lastShotData["offline_m"], "m"),
                totalSpin: lastShotData["total_spin_rpm"],
                sideSpin: lastShotData["side_spin_rpm"],
                backSpin: lastShotData["back_spin_rpm"],
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

            if (shotDatas.length >= props.selectedDrillConfiguration.getNumberOfShots()) {
                // shot executed but number of shots was already reached -> ignore
                console.log(`shot id=${shotData.id} executed but number of shots was already reached -> ignore`);
            } else {
                // add new shot to array
                const shotDatasClone: IShotData[] = [...shotDatas];
                shotDatasClone.push(shotData);
                setShotDatas(shotDatasClone);

                // pick new distance for next shot
                if (shotDatasClone.length < props.selectedDrillConfiguration.getNumberOfShots()) {
                    nextDistanceRef.current = props.selectedDrillConfiguration.getNextDistance(shotDatasClone.length);
                } else {
                    // all shots finished -> set nextDistanceRef to undefined
                    console.log("all shots executed -> save session");
                    nextDistanceRef.current = undefined;
                    props.handleSaveSessions({
                        drillConfiguration: props.selectedDrillConfiguration,
                        shotDatas
                    });
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

    const nextDistanceBox = (): JSX.Element => {
        return (
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
        );
    }

    const oneShotTabName: string = "oneShotTab";
    const allShotsTabName: string = "allShotsTab";
    const [activeTab, setActiveTab] = React.useState(oneShotTabName);

    const oneShotTab = (): JSX.Element => {
        return (
            activeTab === oneShotTabName
                ? <div className="one-shot-tab">
                    <div className="last-shot flex-item">
                        <div className="page-header">
                            <h3>Shot {shotDatas.length} / {props.selectedDrillConfiguration.getNumberOfShots()} </h3>
                        </div>
                        <div className="LastShotData">
                            <LastShotData
                                lastShot={lastShot}
                                shotDatas={shotDatas}
                                selectedDrillConfiguration={props.selectedDrillConfiguration}
                            />
                        </div>
                    </div>
                    <div className="shots-svg flex-item">
                        <div className="page-header">
                            <h3>Dispersion</h3>
                        </div>
                        <div className="ShotsSvg">
                            <ShotsSvg
                                svgNumberOfCircles={svgNumberOfCircles}
                                shotDatas={shotDatas}
                                selectedDrillConfiguration={props.selectedDrillConfiguration}
                            />
                        </div>
                    </div>
                </div>
                : null
        );
    }

    const allShotsTab = (): JSX.Element => {
        return (
            activeTab === allShotsTabName
                ? <div className="all-shots-tab">
                    <div className="all-shots-table-flex-item flex-item">
                        <div className="page-header">
                            <h3>{shotDatas.length} / {props.selectedDrillConfiguration.getNumberOfShots()} Shots in
                                Session</h3>
                        </div>
                        <div className="all-shots-table">
                            <AllShotsTable
                                lastShot={lastShot}
                                shotDatas={shotDatas}
                                selectedDrillConfiguration={props.selectedDrillConfiguration}
                            />
                        </div>
                    </div>
                </div>
                : null
        );
    }

    const shotTabs = (): JSX.Element => {
        return (
            <div className="shot-tabs">
                {/* Tab content */}
                {oneShotTab()}
                {allShotsTab()}

                {/* Tab links */}
                <div className="tab-links">
                    <button
                        className={`tab-link-button ${activeTab === oneShotTabName ? "tab-link-button-active" : ""}`}
                        onClick={() => setActiveTab(oneShotTabName)}
                    >
                        Last Shot and Dispersion
                    </button>
                    <button
                        className={`tab-link-button ${activeTab === allShotsTabName ? "tab-link-button-active" : ""}`}
                        onClick={() => setActiveTab(allShotsTabName)}
                    >
                        All Shots in Session
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="drill-page page">
            {nextDistanceBox()}
            {shotTabs()}

            <div className="top-buttons-flex-item">
                <div className="back-flex-item flex-item">
                        <span className="back-span"
                              onClick={(): void => {
                                  props.handleSelectPageClicked(SelectDrillPageName)
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={backIcon}
                                     alt="Back"
                                />
                            </div>
                        </span>
                </div>
            </div>
        </div>
    );
}
