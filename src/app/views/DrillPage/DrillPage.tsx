import React from 'react';
import Chokidar, {FSWatcher} from 'chokidar';
import './DrillPage.scss';
import {parseCsvToAllRowsAsObjects, parseCsvToFirstRowAsObject} from "../../util/CsvParser";
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import {ShotsSvg} from "../../components/ShotsSvg/ShotsSvg";
import {IShotData, ShotData} from "../../model/ShotData/ShotData";
import {LastShotData} from "../../components/LastShotData/LastShotData";
import {assert} from "chai";
import {NextDistanceBox} from "../../components/NextDistanceBox/NextDistanceBox";
import backIcon from '../../../assets/back.png';
import {RestartButton} from "../../components/RestartButton/RestartButton";
import {Unit} from 'mathjs'
import {AllShotsTable} from "../../components/AllShotsTable/AllShotsTable";
import {ISession, Session} from "../../model/Session/Session";
import {HomePageName} from "../HomePage/HomePage";
import {IPlayer} from "../../model/Player/Player";
import {IAppSettings} from "../../model/AppSettings/AppSettings";
import {
    eventReadAllShotsUpdateType,
    eventReadOnlyLatestShotsUpdateType,
    pollingShotsUpdateType
} from "../../model/SelectValues/ShotsUpdateType";
import moment from "moment/moment";
import {v4 as uuidv4} from "uuid";
import {startPolling} from "../../util/PollingUtil";

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
    const [allShotDataIdsBeforeSessionRead, setAllShotDataIdsBeforeSessionRead] = React.useState<boolean>(false);
    const allShotDataIdsBeforeSessionRef: React.MutableRefObject<number[]> = React.useRef<number[]>(undefined);
    console.log("DDDDDDDDDD: the following shot ids belong to an earlier session and are ignored: allShotDataIdsBeforeSessionRef.current=", allShotDataIdsBeforeSessionRef.current);

    const [nextDistance, setNextDistance] = React.useState<Unit>(props.selectedDrillConfiguration.getNextDistance(knownShotDatasInSession.length));
    const nextDistanceRef: React.MutableRefObject<Unit> = React.useRef<Unit>(nextDistance);

    const checkFirstRowInLastShotCsvFile = async (): Promise<void> => {
        const lastShotDataAsJson: any = await parseCsvToFirstRowAsObject(props.lastShotCsvPath);
        const shotIdFromLastShotFile: number = lastShotDataAsJson["shot_id"];
        if (!!shotIdFromLastShotFile) {
            console.log(`shot id=${shotIdFromLastShotFile} has been executed, lastShotData: ${JSON.stringify(lastShotDataAsJson)}`);
            const shotData: ShotData = ShotData.fromJson(lastShotDataAsJson, nextDistanceRef.current);
            setShotData(shotData);
            // the rest is done in effect for shotData changes
        }
    }

    React.useEffect((): void => {
        // effect for shotData changes
        if ([eventReadOnlyLatestShotsUpdateType].includes(props.appSettings.getShotsUpdateType())) {
            const knownShotDataIdsInSession: number[] = knownShotDatasInSession.map((knownShotDataInSession: IShotData) => knownShotDataInSession.getId());
            if (!!shotData && (knownShotDatasInSession.length === 0 || !knownShotDataIdsInSession.includes(shotData.getId()))) {
                // new shot detected
                if (knownShotDatasInSession.length >= props.selectedDrillConfiguration.getNumberOfShots()) {
                    // shot executed but number of shots was already reached -> ignore
                    console.log(`shot id=${shotData.getId()} executed but number of shots was already reached -> ignore`);
                } else {
                    // add new shot to array
                    const knownShotDatasInSessionClone: IShotData[] = [...knownShotDatasInSession];
                    knownShotDatasInSessionClone.push(shotData);
                    setKnownShotDatasInSession(knownShotDatasInSessionClone);

                    // pick new distance for next shot
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
        }
    }, [shotData]);

    async function checkAllRowsInLastShotCsvFile(): Promise<void> {
        const allShotDatasAsJson: any[] = await parseCsvToAllRowsAsObjects(props.lastShotCsvPath);
        const allShotDataIdsInCsvFile: number[] = allShotDatasAsJson.map(shotDataAsJson => shotDataAsJson["shot_id"])
        console.log("DDDDDDDDDD: the following shot ids were found in CSV file: allShotDataIdsInCsvFile=", allShotDataIdsInCsvFile);

        // all shots that belong to session are in CSV file but do not belong to an earlier session
        const allShotDataIdsInSession: number[] = allShotDataIdsInCsvFile.filter((shotDataId: number) => !allShotDataIdsBeforeSessionRef.current.includes(shotDataId));
        console.log("DDDDDDDDDD: the following shot ids were found in CSV file and belong to current session: allShotDataIdsInSession=", allShotDataIdsInSession);

        if (allShotDataIdsInSession.length > 0) {
            // at least one shot in session
            const knownShotDatasInSessionClone: IShotData[] = [];
            let lastShotData: ShotData = undefined;
            for (let i: number = 0; i < allShotDataIdsInSession.length; i++) {
                const shotDataIdInSession: number = allShotDataIdsInSession[i];
                console.log(`shot in session with id=${shotDataIdInSession} detected`);
                const shotDataAsJson: any = allShotDatasAsJson.find(shotData => shotData["shot_id"] === shotDataIdInSession)
                const shotData: ShotData = ShotData.fromJson(shotDataAsJson, props.selectedDrillConfiguration.getNextDistance(allShotDataIdsInSession.length - 1 - i));
                if (knownShotDatasInSessionClone.length >= props.selectedDrillConfiguration.getNumberOfShots()) {
                    // shot executed but number of shots was already reached -> ignore and do not add to known shots
                    console.log(`shot id=${shotData.getId()} executed but number of shots was already reached -> ignore`);
                } else {
                    // add shot to array of known shots
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

    let stopPolling: boolean = false;

    function shouldStopPolling(): boolean {
        console.log("@shouldStopPolling - stopPolling=", stopPolling)
        return stopPolling;
    };

    const startWatcher = (): void => {
        const callShotUpdateFunction = (): void => {
            if ([eventReadOnlyLatestShotsUpdateType].includes(props.appSettings.getShotsUpdateType())) {
                checkFirstRowInLastShotCsvFile();
            } else if ([eventReadAllShotsUpdateType].includes(props.appSettings.getShotsUpdateType())) {
                checkAllRowsInLastShotCsvFile();
            } else {
                assert.fail(`shots update type unknown: ${props.appSettings.getShotsUpdateType()}`)
            }
        }

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
                callShotUpdateFunction();
            })
            .on('addDir', (path: string): void => {
                console.log('Directory', path, 'has been added');
            })
            .on('change', (path: string): void => {
                console.log('File', path, 'has been changed');
                callShotUpdateFunction();
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
    }

    React.useEffect((): void => {
        // in case we always read all shots we need to know the ids of earlier shots -> check what is already inside the lastShotData csv file when new session starts
        (async (): Promise<void> => {
            allShotDataIdsBeforeSessionRef.current =
                ([eventReadAllShotsUpdateType, pollingShotsUpdateType].includes(props.appSettings.getShotsUpdateType()))
                    ? (await parseCsvToAllRowsAsObjects(props.lastShotCsvPath)).map(shotDataBeforeSession => shotDataBeforeSession["shot_id"])
                    : [];
            // FOR TESTING OF LOADING ANIMATION: await new Promise(resolve => setTimeout(resolve, 1000));
            // force redraw of page to show drill/shot data and hide loading animation
            setAllShotDataIdsBeforeSessionRead(true);
        })()

        if ([eventReadOnlyLatestShotsUpdateType, eventReadAllShotsUpdateType].includes(props.appSettings.getShotsUpdateType())) {
            console.log("start watcher for event-driven shots file reading");
            startWatcher();
        } else {
            console.log(`do not start start watcher but start polling every ${props.appSettings.getPollingInterval()} milliseconds for changes of last shots csv file instead`);
            startPolling(checkAllRowsInLastShotCsvFile, props.appSettings.getPollingInterval(), shouldStopPolling)
        }
    }, [props.appSettings, props.lastShotCsvPath])

    const restart = (): void => {
        // reset the state of the selectedDrillConfiguration object
        props.selectedDrillConfiguration.reset();

        // update react states and refs
        allShotDataIdsBeforeSessionRef.current = [
            ...knownShotDatasInSession.map((shotData: IShotData) => shotData.getId()),
            ...allShotDataIdsBeforeSessionRef.current,
        ];
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
    return allShotDataIdsBeforeSessionRead
        ? (<div className="drill-page page">
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
        </div>)
        : (<div className="loading-drill-page page">
            <div className="loading-spinner-div">
                Loading last shots CSV file...
            </div>
            <div className="loading-spinner-div">
                <div className="loading-spinner"/>
            </div>
        </div>);
}
