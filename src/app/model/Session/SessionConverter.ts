import {assert} from "chai";
import {ISession, Session} from "./Session";
import {drillConfigurationsFromJson} from "../DrillConfiguration/DrillConfigurationConverter";
import {IAverageStrokesData} from "../AverageStrokesData/AverageStrokesData";
import {shotDatasFromJson} from "../ShotData/ShotDataConverter";
import {IDrillConfiguration} from "../DrillConfiguration/DrillConfiguration";

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
            const drillConfiguration: IDrillConfiguration = drillConfigurationsFromJson([sessionAsJson.drillConfiguration], averageStrokesDataMap)[0];
            return !!drillConfiguration
                ? new Session(
                    sessionAsJson.uuid,
                    sessionAsJson.name,
                    sessionAsJson.playerUuid,
                    drillConfiguration,
                    shotDatasFromJson(sessionAsJson.shotDatas))
                : null; // this might happen if json session file is not correct -> ignore
        })
        .filter((session: ISession) => !!session);
}
