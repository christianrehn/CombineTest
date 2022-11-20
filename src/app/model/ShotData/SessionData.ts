import {ShotDataX} from "./ShotDataX";
import fs from "fs";

type StatsType = {
    name: string,
    atime: number,
    mtime: number,
    size: number,
}

export interface ISessionData {
    getSessionID: () => string;
    getShotDataXs: () => ShotDataX[];
}

export class SessionData implements ISessionData {
    protected _sessionID: string;
    protected _sessionStartDate: string;
    protected _sessionStartTime: string;
    protected _sessionType: string;
    protected _shotDataXs: ShotDataX[];

    constructor(
        sessionID: string,
        sessionStartDate: string,
        sessionStartTime: string,
        sessionType: string,
        shotDataXs: ShotDataX[]
    ) {
        this._sessionID = sessionID;
        this._sessionStartDate = sessionStartDate;
        this._sessionStartTime = sessionStartTime;
        this._sessionType = sessionType;
        this._shotDataXs = shotDataXs;
    }

    public getSessionID = (): string => {
        return this._sessionID;
    }

    public getShotDataXs = (): ShotDataX[] => {
        return this._shotDataXs;
    }

    public static findShotDataXsInLatestSessionJsonFile = async (sessionJsonDir: string): Promise<SessionData> => {
        // get all all files in props.sessionJsonDir
        const sessionFileNames: string[] = await fs.readdirSync(sessionJsonDir);
        const sessionFileStats: StatsType[] = sessionFileNames.map((fileName: string): StatsType => {
            const stats: fs.Stats = fs.statSync(`${sessionJsonDir}/${fileName}`);
            return {
                name: fileName,
                atime: stats.atime.getTime(),
                mtime: stats.mtime.getTime(),
                size: stats.size,
            };
        })
            .sort((a: StatsType, b: StatsType) => b.mtime - a.mtime);
        console.log("all session files", sessionFileStats.map((file: StatsType) => file.name));

        try {
            if (sessionFileStats.length > 0) {
                // find the latest session file and read it
                const latestSessionFileStat: StatsType = sessionFileStats[0];
                console.log("latest session file", latestSessionFileStat);
                let sessionRawData: Buffer = fs.readFileSync(`${sessionJsonDir}/${latestSessionFileStat.name}`);
                let sessionJsonData = JSON.parse(sessionRawData.toString());
                console.log("sessionJsonData", sessionJsonData);
                if (sessionJsonData.hasOwnProperty("Shots")) {
                    const sessionShotDatasAsJson: any[] = sessionJsonData.Shots;
                    console.log("shotDatasAsJson=", sessionShotDatasAsJson);

                    // convert json objects to ShotData objects
                    const shotDatasX: ShotDataX[] = (sessionShotDatasAsJson.map((sessionShotDataAsJson: any) =>
                        ShotDataX.fromSessionShotDataJson(sessionShotDataAsJson))) ?? [];
                    return new SessionData(
                        sessionJsonData["SessionID"],
                        sessionJsonData["SessionStartDate"],
                        sessionJsonData["SessionStartTime"],
                        sessionJsonData["SessionType"],
                        shotDatasX);
                }
            }

            return undefined;
        } catch (error) {
            console.error(`@findShotDataXsInLatestSessionJsonFile - error reading session file: ${error}`);
            return undefined;
        }
    };

}
