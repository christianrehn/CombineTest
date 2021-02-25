import {assert} from "chai";

export interface IShotData {
    id: number,
    carry: number,
    offline: number,
    targetDistance: number,
}

export const computeAbsoluteDeviation = (shotData: IShotData): number => {
    assert(!!shotData, "!shotData");

    const deltaDistance: number = shotData.carry - shotData.targetDistance;
    const absoluteDeviation: number = Math.sqrt(deltaDistance * deltaDistance + shotData.offline * shotData.offline);
    return absoluteDeviation;
}

export const computeRelativeDeviation = (shotData: IShotData): number => {
    assert(!!shotData, "!shotData");

    const absoluteDeviation: number = computeAbsoluteDeviation(shotData);
    const relativeDeviation: number = absoluteDeviation / shotData.targetDistance;
    return relativeDeviation;
}
