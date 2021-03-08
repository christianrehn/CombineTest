import {assert} from "chai";
import * as math from "mathjs";
import {Unit} from "mathjs";
import {AverageStrokesDataGroundTypeEnum} from "./AverageStrokesData";

export const BGV_DISTANCES: number[] = [6, 14, 22, 30, 38, 46, 54, 62, 70];

/**
 * Create random integer between [min, max[.
 */
const createRandomNumber = (minIncluded: number, maxExcluded: number): number => {
    assert(minIncluded <= maxExcluded, "min > max");

    if (minIncluded === maxExcluded) {
        return minIncluded;
    }

    return Math.floor(Math.random() * Math.floor(maxExcluded - minIncluded)) + minIncluded;
}

export interface IDistancesGenerator {
    getNext: (index: number) => Unit;
    reset: () => void;
    description: string;
    numberOfDistances: number;
    unit: string;
    averageShotsStartGroundTypeEnum: AverageStrokesDataGroundTypeEnum;
}

export class RandomDistancesGenerator implements IDistancesGenerator {
    private readonly _minIncludedDistance: number;
    private readonly _maxExcludedDistance: number;
    private readonly _unit: string;
    private readonly _averageShotsStartGroundTypeEnum: AverageStrokesDataGroundTypeEnum;

    constructor(minIncludedDistance: number, maxExcludedDistance: number, unit: string, averageShotsStartGroundTypeEnum: AverageStrokesDataGroundTypeEnum) {
        this._minIncludedDistance = minIncludedDistance;
        this._maxExcludedDistance = maxExcludedDistance;
        this._unit = unit;
        this._averageShotsStartGroundTypeEnum = averageShotsStartGroundTypeEnum;
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

    get numberOfDistances(): number {
        return 1;
    }

    get unit(): string {
        return this._unit;
    }

    get averageShotsStartGroundTypeEnum(): AverageStrokesDataGroundTypeEnum {
        return this._averageShotsStartGroundTypeEnum;
    }
}

export class FixedDistancesGenerator implements IDistancesGenerator {
    protected readonly _distances: number[];
    protected readonly _unit: string;
    protected readonly _averageShotsStartGroundTypeEnum: AverageStrokesDataGroundTypeEnum;

    constructor(distances: number[], unit: string, averageShotsStartGroundTypeEnum: AverageStrokesDataGroundTypeEnum) {
        this._distances = distances;
        this._unit = unit;
        this._averageShotsStartGroundTypeEnum = averageShotsStartGroundTypeEnum;
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

    get numberOfDistances(): number {
        return this._distances.length;
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

    constructor(distances: number[], unit: string, averageShotsGroundTypeEnum: AverageStrokesDataGroundTypeEnum) {
        super(distances, unit, averageShotsGroundTypeEnum);
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
