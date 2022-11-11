import React from 'react';
import Chokidar, {FSWatcher} from 'chokidar';
import './DrillPage.scss';
import {parseCsvToAllRowsAsObjects} from "../../util/CsvParser";
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import {ShotsSvg} from "../../components/ShotsSvg/ShotsSvg";
import {IShotData, ShotData} from "../../model/ShotData/ShotData";
import {LastShotData} from "../../components/LastShotData/LastShotData";
import {assert} from "chai";
import {NextDistanceBox} from "../../components/NextDistanceBox/NextDistanceBox";
import backIcon from '../../../assets/back.png';
import {RestartButton} from "../../components/RestartButton/RestartButton";
import * as math from 'mathjs'
import {Unit} from 'mathjs'
import {AllShotsTable} from "../../components/AllShotsTable/AllShotsTable";
import {ISession, Session} from "../../model/Session/Session";
import {HomePageName} from "../HomePage/HomePage";
import {IPlayer} from "../../model/Player/Player";
import {IAppSettings} from "../../model/AppSettings/AppSettings";
import {eventShotsUpdateType} from "../../model/SelectValues/ShotsUpdateType";
import {poll} from "../../util/PollingUtil";
import moment from "moment/moment";
import {v4 as uuidv4} from "uuid";

export const DrillPageName: string = "DrillPage";

interface IDrillPageProps {
    appSettings: IAppSettings;
    lastShotCsvPath: string;
    selectedPlayer: IPlayer;
    selectedSession: ISession;
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
    const [knownShotDatasInSession, setKnownShotDatasInSession] = React.useState<IShotData[]>([]);
    console.log("XXXXXXXXXXXXXXXXXXXXX knownShotDatasInSession", JSON.stringify(knownShotDatasInSession, null, 2));
    let allShotDataIdsBeforeSession: number[] = [];
    const [nextDistance, setNextDistance] = React.useState<Unit>(props.selectedDrillConfiguration.getNextDistance(knownShotDatasInSession.length));
    const nextDistanceRef: React.MutableRefObject<Unit> = React.useRef<Unit>(nextDistance);

    async function checkLastShotCsvFile(): Promise<void> {
        const allShotDatas: any[] = await parseCsvToAllRowsAsObjects(props.lastShotCsvPath);
        const allShotDataIdsInCsvFile: number[] = allShotDatas.map(shotData => shotData["shot_id"])
        const allShotDataIdsInSession: number[] = allShotDataIdsInCsvFile.filter((shotDataId: number) => !allShotDataIdsBeforeSession.includes(shotDataId));
        const knownShotDataIdsInSession: number[] = knownShotDatasInSession.map((shotData: IShotData) => shotData.getId())
        const newShotDataIdsInSession: number[] = allShotDataIdsInSession.filter((shotDataId: number) => !knownShotDataIdsInSession.includes(shotDataId));
        console.log("allShotDataIdsInCsvFile", allShotDataIdsInCsvFile, new Date());
        console.log("allShotDataIdsBeforeSession", allShotDataIdsBeforeSession);
        console.log("allShotDataIdsInSession", allShotDataIdsInSession);
        console.log("YYYYYYYYYYYYYYYYYYYY knownShotDatasInSession", JSON.stringify(knownShotDatasInSession, null, 2));
        console.log("knownShotDataIdsInSession", knownShotDataIdsInSession);
        console.log("newShotDataIdsInSession", newShotDataIdsInSession);

        if (newShotDataIdsInSession.length > 0) {
            // new shot(s) detected
            const knownShotDatasInSessionClone: IShotData[] = [...knownShotDatasInSession];
            let lastShotData: ShotData = undefined;
            for (let i: number = 0; i < newShotDataIdsInSession.length; i++) {
                const newShotDataIdInSession: number = newShotDataIdsInSession[i];
                console.log(`new shot with id=${newShotDataIdInSession} detected`);
                const newShotData: any = allShotDatas.find(shotData => shotData["shot_id"] === newShotDataIdInSession)
                const shotData: ShotData = new ShotData(
                    newShotDataIdInSession,
                    newShotData["club"],
                    math.unit(newShotData["club_head_speed_ms"], "m"),
                    math.unit(newShotData["carry_m"], "m"),
                    math.unit(newShotData["total_distance_m"], "m"),
                    math.unit(newShotData["offline_m"], "m"),
                    newShotData["total_spin_rpm"],
                    newShotData["side_spin_rpm"],
                    newShotData["back_spin_rpm"],
                    nextDistanceRef.current
                );
                if (knownShotDatasInSessionClone.length >= props.selectedDrillConfiguration.getNumberOfShots()) {
                    // shot executed but number of shots was already reached -> ignore and do not add to known shots
                    console.log(`shot id=${shotData.getId()} executed but number of shots was already reached -> ignore`);
                } else {
                    // add new shot to array of known shots
                    knownShotDatasInSessionClone.push(shotData);

                    // this shot might have been the last one
                    lastShotData = shotData;
                }
            }
            // update states
            assert(!!lastShotData, "!lastShotData");
            setShotData(lastShotData); // show data of the last shot
            setKnownShotDatasInSession(knownShotDatasInSessionClone);

            // finally pick new distance for next shot
            if (knownShotDatasInSessionClone.length < props.selectedDrillConfiguration.getNumberOfShots()) {
                nextDistanceRef.current = props.selectedDrillConfiguration.getNextDistance(knownShotDatasInSessionClone.length);
            } else {
                // all shots finished -> set nextDistanceRef to undefined
                const sessionName: string = moment(new Date()).format("YYMMDD_HHmmss");
                console.log(`all shots executed -> save session ${sessionName}`);
                nextDistanceRef.current = undefined;
                props.handleSaveSessions(new Session(
                    uuidv4(),
                    sessionName,
                    props.selectedPlayer?.getUuid(),
                    props.selectedDrillConfiguration,
                    knownShotDatasInSessionClone))
            }
            setNextDistance(nextDistanceRef.current);
        }
    }

    async function readShotDataIdsBeforeSessionAndStartPolling(): Promise<void> {
        // check what is already insight the lastShotData csv file when new session starts
        const shotDatasBeforeSession: any[] = await parseCsvToAllRowsAsObjects(props.lastShotCsvPath);
        allShotDataIdsBeforeSession = shotDatasBeforeSession.map(shotDataBeforeSession => shotDataBeforeSession["shot_id"])
        console.log("shotDataIdsBeforeSession", allShotDataIdsBeforeSession);
        console.log("DONE reading shotDataIds before session DONE -> start polling now")

        poll(checkLastShotCsvFile, props.appSettings.getPollingInterval(), shouldStopPolling)
    }

    let stopPolling: boolean = false;

    function shouldStopPolling(): boolean {
        console.log("@shouldStopPolling - stopPolling=", stopPolling)
        return stopPolling;
    };

    React.useEffect((): void => {
        if (props.appSettings.getShotsUpdateType() === eventShotsUpdateType) {
            console.log("start watcher");
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
                    checkLastShotCsvFile();
                })
                .on('addDir', (path: string): void => {
                    console.log('Directory', path, 'has been added');
                })
                .on('change', (path: string): void => {
                    console.log('File', path, 'has been changed');
                    checkLastShotCsvFile();
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
        } else {
            console.log(`do not start start watcher but start polling every ${props.appSettings.getPollingInterval()} milliseconds for changes of last shots csv file instead`);
            readShotDataIdsBeforeSessionAndStartPolling().catch(console.error);
        }
    }, [props.appSettings, props.lastShotCsvPath])

    // CRTODO
    const restart = (): void => {
        props.selectedDrillConfiguration.reset();
        setKnownShotDatasInSession([]);
        nextDistanceRef.current = (props.selectedDrillConfiguration).getNextDistance(0);
        setNextDistance(nextDistanceRef.current);
    }

    const lastShot: IShotData | undefined = knownShotDatasInSession.length > 0 ? knownShotDatasInSession[knownShotDatasInSession.length - 1] : undefined;

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

    const oneShotTab = (nextDistance: Unit): JSX.Element => {
        return (
            activeTab === oneShotTabName
                ? <div className="one-shot-tab">
                    <div className="last-shot flex-item">
                        <div className="page-header">
                            <h3>Shot {knownShotDatasInSession.length} / {props.selectedDrillConfiguration.getNumberOfShots()} </h3>
                        </div>
                        <div className="LastShotData">
                            <LastShotData
                                lastShot={lastShot}
                                shotDatas={knownShotDatasInSession}
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
                                shotDatas={knownShotDatasInSession}
                                selectedDrillConfiguration={props.selectedDrillConfiguration}
                                nextDistance={nextDistance}
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
                            <h3>{knownShotDatasInSession.length} / {props.selectedDrillConfiguration.getNumberOfShots()} Shots
                                in
                                Session</h3>
                        </div>
                        <div className="all-shots-table">
                            <AllShotsTable
                                shotDatas={knownShotDatasInSession}
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
                {oneShotTab(nextDistanceRef.current)}
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
                                  stopPolling = true;
                                  props.handleSelectPageClicked(HomePageName)
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
