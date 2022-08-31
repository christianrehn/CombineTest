import {assert} from "chai";
import {ISession} from "./Session";

export const sessionsToString = (
    sessions: ISession[],
): string => {
    assert(sessions !== undefined, "sessions === undefined");
    assert(sessions !== null, "sessions === null");

    return JSON.stringify(sessions);
}

export const sessionsFromJson = (
    sessionsAsJson: any[],
): ISession[] => {
    assert(sessionsAsJson !== undefined, "sessionsAsJson === undefined");
    assert(sessionsAsJson !== null, "sessionsAsJson === null");

    return sessionsAsJson;
}
