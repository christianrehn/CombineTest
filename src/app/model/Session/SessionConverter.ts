import {assert} from "chai";
import {ISession, Session} from "./Session";

export const sessionsToString = (
    sessions: ISession[],
): string => {
    assert(sessions !== undefined, "sessions === undefined");
    assert(sessions !== null, "sessions === null");

    const sessionsAsJson: any[] = sessions.map((session: ISession) => {
        return session.toJson();
    });
    return JSON.stringify(sessionsAsJson);
}

export const sessionsFromJson = (
    sessionsAsJson: any[],
): ISession[] => {
    assert(sessionsAsJson !== undefined, "sessionsAsJson === undefined");
    assert(sessionsAsJson !== null, "sessionsAsJson === null");

    return sessionsAsJson
        .map((sessionAsJson: any): ISession => {
            return new Session(
                sessionAsJson.uuid,
                sessionAsJson.playerUuid,
                sessionAsJson.drillConfiguration,
                sessionAsJson.shotDatas)
        })
        .filter((session: ISession) => !!session);
}
