import {assert} from "chai";
import * as math from "mathjs";
import {MathType, Unit} from "mathjs";

export interface IShotData {
    id: number,
    carry: Unit,
    totalDistance: Unit,
    offline: Unit,
    targetDistance: Unit,
}

export const computeAbsoluteDeviation = (shotData: IShotData): Unit => {
    assert(!!shotData, "!shotData");

    const deltaDistance: Unit = math.subtract(shotData.carry, shotData.targetDistance) as Unit;
    const absoluteDeviation: MathType = math.sqrt(math.add(math.square(deltaDistance), math.square(shotData.offline)) as Unit);
    return absoluteDeviation;
}

export const computeRelativeDeviation = (shotData: IShotData): number => {
    assert(!!shotData, "!shotData");
    console.log("shotData.targetDistance.formatUnits()", shotData.targetDistance.formatUnits());

    const absoluteDeviationAsNumber: number = computeAbsoluteDeviation(shotData).toNumber(shotData.targetDistance.formatUnits());
    const targetDistanceAsNumber: number = shotData.targetDistance.toNumber(shotData.targetDistance.formatUnits());
    const relativeDeviation: number = absoluteDeviationAsNumber / targetDistanceAsNumber;
    return relativeDeviation;
}
