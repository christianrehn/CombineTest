import {assert} from "chai";
import * as math from "mathjs";
import {Unit} from "mathjs";
import {AverageStrokesDataGroundTypeEnum} from "./AverageStrokesData";

export const BGV_DISTANCES: number[] = [6, 14, 22, 30, 38, 46, 54, 62, 70];

/**
 * Create random integer between [min, max[.
 */
const createRandomNumber = (minIncluded: number, maxExcluded: number): number => {
    assert(minIncluded <= maxExcluded, `min (${minIncluded}) > max (${maxExcluded})`);

    if (minIncluded === maxExcluded) {
        return minIncluded;
    }

    return Math.floor(Math.random() * Math.floor(maxExcluded - minIncluded)) + minIncluded;
}

export interface IDistancesGenerator {
    getNext: (index: number) => Unit;
    reset: () => void;
    description: string;
    numberOfShots: number;
    unit: string;
    averageShotsStartGroundTypeEnum: AverageStrokesDataGroundTypeEnum;
}

abstract class AbstractDistanceGenerator {
    protected readonly _averageShotsStartGroundTypeEnum: AverageStrokesDataGroundTypeEnum;

    private static getEnumKeyByEnumValue<T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | null {
        let keys: string[] = Object.keys(myEnum).filter((x: string): boolean => myEnum[x] == enumValue);
        return keys.length > 0 ? keys[0] : null;
    }

    constructor(startGroundType: string) {
        this._averageShotsStartGroundTypeEnum =
            AverageStrokesDataGroundTypeEnum[
                AbstractDistanceGenerator.getEnumKeyByEnumValue(AverageStrokesDataGroundTypeEnum, startGroundType)
                ];
    }
}

export class RandomDistancesGenerator extends AbstractDistanceGenerator implements IDistancesGenerator {
    private readonly _minIncludedDistance: number;
    private readonly _maxExcludedDistance: number;
    private readonly _unit: string;
    private readonly _numberOfShots: number;

    constructor(
        minIncludedDistance: number,
        maxExcludedDistance: number,
        unit: string,
        numberOfShots: number,
        startGroundType: string) {
        super(startGroundType);

        this._minIncludedDistance = minIncludedDistance;
        this._maxExcludedDistance = maxExcludedDistance;
        this._unit = unit;
        this._numberOfShots = numberOfShots;
    }

    reset(): void {
        // nothing to do
    }

    public getNext(index: number): Unit {
        assert(index >= 0, "index < 0");

        return math.unit(createRandomNumber(this._minIncludedDistance, this._maxExcludedDistance), this._unit);
    }

    get description(): string {
        return `Random Distances between ${this._minIncludedDistance} and ${this._maxExcludedDistance} ${this._unit} from ${this.averageShotsStartGroundTypeEnum}`;
    }

    get numberOfShots(): number {
        return this._numberOfShots;
    }

    get unit(): string {
        return this._unit;
    }

    get averageShotsStartGroundTypeEnum(): AverageStrokesDataGroundTypeEnum {
        return this._averageShotsStartGroundTypeEnum;
    }
}

export class FixedDistancesGenerator extends AbstractDistanceGenerator implements IDistancesGenerator {
    protected readonly _distances: number[];
    protected readonly _unit: string;
    protected readonly _numberOfRounds: number;

    constructor(
        distances: number[],
        unit: string,
        numberOfRounds: number,
        startGroundType: string) {
        super(startGroundType);

        this._distances = distances;
        this._unit = unit;
        this._numberOfRounds = numberOfRounds;
    }

    reset(): void {
        // nothing to do
    }

    public getNext(index: number): Unit {
        assert(index >= 0, "index < 0");

        return math.unit(this._distances[index % this._distances.length], this._unit);
    }

    get description(): string {
        return `Fixed Distances in fixed order: ${this._distances} ${this._unit} from ${this.averageShotsStartGroundTypeEnum}`;
    }

    get numberOfShots(): number {
        return this._distances.length * this._numberOfRounds;
    }

    get unit(): string {
        return this._unit;
    }

    get averageShotsStartGroundTypeEnum(): AverageStrokesDataGroundTypeEnum {
        return this._averageShotsStartGroundTypeEnum;
    }
}

export class RandomFromFixedDistancesGenerator extends FixedDistancesGenerator implements IDistancesGenerator {
    private distancesNotYetReturned: number[];
    private distancesReturnedMap: Map<number, number> = new Map<number, number>();

    constructor(
        distances: number[],
        unit: string,
        numberOfRounds: number,
        startGroundType: string) {
        super(distances, unit, numberOfRounds, startGroundType);
        this.distancesNotYetReturned = [...distances];
    }

    reset(): void {
        this.distancesNotYetReturned = [...this._distances];
        this.distancesReturnedMap = new Map<number, number>()
    }

    public getNext(index: number): Unit {
        console.log("getNext, index=", index);
        assert(index >= 0, "index < 0");

        if (this.distancesReturnedMap.has(index)) {
            // value for this index has already been returned earlier
            return math.unit(this.distancesReturnedMap.get(index), this._unit);
        }

        if (this.distancesNotYetReturned.length === 0) {
            // all distances values have been randomly picked one time -> restart with all distances values
            this.distancesNotYetReturned = [...this._distances];
        }

        // pick and remove one element of distancesNotYetReturned
        const notYetReturnedIndex: number = createRandomNumber(0, this.distancesNotYetReturned.length);
        const next: number[] = this.distancesNotYetReturned.splice(notYetReturnedIndex, 1);
        assert(next.length === 1, "next.length !== 1");

        // remember picked element
        this.distancesReturnedMap.set(index, next[0]);

        return math.unit(next[0], this._unit);
    }

    get description(): string {
        return `Fixed Distances in random order: ${this._distances} ${this._unit} from ${this.averageShotsStartGroundTypeEnum}`;
    }
}
