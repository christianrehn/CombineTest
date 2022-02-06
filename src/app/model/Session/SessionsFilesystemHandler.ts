import {ipcRenderer} from "electron";
import {ISession} from "./Session";
import {sessionsToString} from "./SessionConverter";

export const loadSessionsAsJson = (): any[] => {
    const sessionAsString: string = ipcRenderer.sendSync('loadSessionsAsString', undefined);
    if (!sessionAsString) {
        console.log("loadSessionsAsJson - no sessions file found");
        return [];
    }
    const sessionAsJson = JSON.parse(sessionAsString);
    console.log("loadSessionsAsJson - sessionAsJson=", sessionAsJson)
    return sessionAsJson;
}

export const saveSessions = (sessions: ISession[]): void => {
    console.log("saveSessions - sessions=", sessions);

    const sessionsAsString: string = sessionsToString(sessions);
    const success = ipcRenderer.sendSync('saveSessions', sessionsAsString);
    console.log("saveSessions - success=", success);
}
