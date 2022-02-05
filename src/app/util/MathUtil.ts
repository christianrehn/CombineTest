import {assert} from "chai";
import * as math from "mathjs";
import {MathType, Unit} from "mathjs";
import {IShotData} from "../model/ShotData";

export const computeSum = (values: number[]) => {
    assert(values.length > 0, "!values.length > 0");

    return values.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
}

export const computeAverage = (values: number[]) => {
    assert(values.length > 0, "!values.length > 0");

    return computeSum(values) / values.length;
}

export const computeStandardDeviationEntirePopulation = (values: number[]): number => {
    assert(values.length > 0, "!values.length > 0");

    const deltaToAverageValues: number[] = values.map((value: number) => value - computeAverage(values));
    const deltaToAverageSquareSum: number = deltaToAverageValues.reduce((accumulator: number, currentValue: number) => accumulator + (currentValue * currentValue), 0);
    return Math.sqrt(deltaToAverageSquareSum / values.length); // based on the entire population -> divide by length
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
