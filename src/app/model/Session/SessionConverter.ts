import {assert} from "chai";
import {ISession, Session} from "./Session";
import {drillConfigurationsFromJson} from "../DrillConfiguration/DrillConfigurationConverter";
import {IAverageStrokesData} from "../AverageStrokesData/AverageStrokesData";
import {shotDatasFromJson} from "../ShotData/ShotDataConverter";

export const sessionsToString = (
    sessions: ISession[],
): string => {
    assert(sessions !== undefined, "sessions === undefined");
    assert(sessions !== null, "sessions === null");

    const sessionsAsJson: any[] = sessions.map((session: ISession) => {
        assert(!!session.getName(), "!!session.getName()")
        return session.toJson();
    });
    return JSON.stringify(sessionsAsJson);
}

export const sessionsFromJson = (
    sessionsAsJson: any[],
    averageStrokesDataMap: Map<string, IAverageStrokesData>
): ISession[] => {
    assert(sessionsAsJson !== undefined, "sessionsAsJson === undefined");
    assert(sessionsAsJson !== null, "sessionsAsJson === null");

    return sessionsAsJson
        .map((sessionAsJson: any): ISession => {
            return new Session(
                sessionAsJson.uuid,
                sessionAsJson.name,
                sessionAsJson.playerUuid,
                drillConfigurationsFromJson([sessionAsJson.drillConfiguration], averageStrokesDataMap)[0],
                shotDatasFromJson(sessionAsJson.shotDatas))
        })
        .filter((session: ISession) => !!session);
}
