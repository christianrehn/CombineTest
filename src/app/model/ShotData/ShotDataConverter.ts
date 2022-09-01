import {assert} from "chai";
import {IShotData, ShotData} from "./ShotData";
import * as math from "mathjs";

export const shotDatasToString = (
    shotDatas: IShotData[],
): string => {
    assert(shotDatas !== undefined, "shotDatas === undefined");
    assert(shotDatas !== null, "shotDatas === null");

    const shotDatasAsJson: any[] = shotDatas.map((shotData: IShotData) => {
        return shotData.toJson();
    });
    return JSON.stringify(shotDatasAsJson);
}

const unitFromJson = (mathJson: math.MathJSON) => {
    return math.unit(mathJson.value, mathJson.unit)
}

export const shotDatasFromJson = (
    shotDatasAsJson: any[],
): IShotData[] => {
    assert(shotDatasAsJson !== undefined, "shotDatasAsJson === undefined");
    assert(shotDatasAsJson !== null, "shotDatasAsJson === null");

    return shotDatasAsJson
        .map((shotDataAsJson: any): IShotData => {
            return new ShotData(
                shotDataAsJson.id,
                shotDataAsJson.club,
                unitFromJson(shotDataAsJson.clubHeadSpeed),
                unitFromJson(shotDataAsJson.carry),
                unitFromJson(shotDataAsJson.totalDistance),
                unitFromJson(shotDataAsJson.offline),
                shotDataAsJson.totalSpin,
                shotDataAsJson.sideSpin,
                shotDataAsJson.backSpin,
                unitFromJson(shotDataAsJson.targetDistance));
        })
        .filter((shotData: IShotData) => !!shotData);
}
