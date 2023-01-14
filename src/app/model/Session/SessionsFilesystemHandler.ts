import {ipcRenderer} from "electron";
import {ISession} from "./Session";
import {sessionsToString} from "./SessionConverter";

type LoadSessionsAsStringReturnType = { sessionsFilename: string, sessionsAsString: string }
export type LoadSessionsAsJsonReturnType = { sessionsFilename: string, sessionsAsJson: any[] }

export const loadSessionsAsJson = (): LoadSessionsAsJsonReturnType => {
    const {
        sessionsFilename,
        sessionsAsString,
    }: LoadSessionsAsStringReturnType = ipcRenderer.sendSync('loadSessionsAsString', undefined);
    if (!sessionsAsString) {
        console.log("loadSessionsAsJson - no sessions file found");
        return {
            sessionsFilename,
            sessionsAsJson: [],
        };
    }
    const sessionsAsJson = JSON.parse(sessionsAsString);
    console.log("loadSessionsAsJson - sessionsAsJson=", sessionsAsJson)
    return {
        sessionsFilename,
        sessionsAsJson
    };
}

export const saveSessions = (sessions: ISession[]): void => {
    console.log("saveSessions - sessions=", sessions);

    const sessionsAsString: string = sessionsToString(sessions);
    const success = ipcRenderer.sendSync('saveSessions', sessionsAsString);
    console.log("saveSessions - success=", success);
}
