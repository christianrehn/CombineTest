import {assert} from "chai";
import * as math from "mathjs";
import {Unit} from "mathjs";
import {AverageShotsGroundTypeEnum} from "./AverageShots";

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
    getName: () => string;
    getDescription: () => string;
    getNumberOfDistances: () => number;
    getUnit: () => string;
    averageShotsGroundTypeEnum: AverageShotsGroundTypeEnum;
}

export class RandomDistancesGenerator implements IDistancesGenerator {
    private readonly minIncludedDistance: number;
    private readonly maxExcludedDistance: number;
    private readonly unit: string;
    private readonly _averageShotsGroundTypeEnum: AverageShotsGroundTypeEnum;

    constructor(minIncludedDistance: number, maxExcludedDistance: number, unit: string, averageShotsGroundTypeEnum: AverageShotsGroundTypeEnum) {
        this.minIncludedDistance = minIncludedDistance;
        this.maxExcludedDistance = maxExcludedDistance;
        this.unit = unit;
        this._averageShotsGroundTypeEnum = averageShotsGroundTypeEnum;
    }

    reset(): void {
        // nothing to do
    }

    public getNext(index: number): Unit {
        assert(index >= 0, "index < 0");

        return math.unit(createRandomNumber(this.minIncludedDistance, this.maxExcludedDistance), this.unit);
    }

    public getName(): string {
        return this.getDescription();
    }

    public getDescription(): string {
        return `Random Distances between ${this.minIncludedDistance} and ${this.maxExcludedDistance} ${this.unit} from ${this.averageShotsGroundTypeEnum}`;
    }

    getNumberOfDistances(): number {
        return 1;
    }

    getUnit(): string {
        return this.unit;
    }

    get averageShotsGroundTypeEnum(): AverageShotsGroundTypeEnum {
        return this._averageShotsGroundTypeEnum;
    }
}

export class FixedDistancesGenerator implements IDistancesGenerator {
    protected readonly distances: number[];
    protected readonly unit: string;
    protected readonly _averageShotsGroundTypeEnum: AverageShotsGroundTypeEnum;

    constructor(distances: number[], unit: string, averageShotsGroundTypeEnum: AverageShotsGroundTypeEnum) {
        this.distances = distances;
        this.unit = unit;
        this._averageShotsGroundTypeEnum = averageShotsGroundTypeEnum;
    }

    reset(): void {
        // nothing to do
    }

    public getNext(index: number): Unit {
        assert(index >= 0, "index < 0");

        return math.unit(this.distances[index % this.distances.length], this.unit);
    }

    public getName(): string {
        return this.getDescription();
    }

    public getDescription(): string {
        return `Fixed Distances in fixed order: ${this.distances} ${this.unit} from ${this.averageShotsGroundTypeEnum}`;
    }

    public getNumberOfDistances(): number {
        return this.distances.length;
    }

    public getUnit(): string {
        return this.unit;
    }

    get averageShotsGroundTypeEnum(): AverageShotsGroundTypeEnum {
        return this._averageShotsGroundTypeEnum;
    }
}

export class RandomFromFixedDistancesGenerator extends FixedDistancesGenerator implements IDistancesGenerator {
    private distancesNotYetReturned: number[];
    private distancesReturnedMap: Map<number, number> = new Map<number, number>();

    constructor(distances: number[], unit: string, averageShotsGroundTypeEnum: AverageShotsGroundTypeEnum) {
        super(distances, unit, averageShotsGroundTypeEnum);
        this.distancesNotYetReturned = [...distances];
    }

    reset(): void {
        this.distancesNotYetReturned = [...this.distances];
        this.distancesReturnedMap = new Map<number, number>()
    }

    public getNext(index: number): Unit {
        console.log("getNext, index=", index);
        assert(index >= 0, "index < 0");

        if (this.distancesReturnedMap.has(index)) {
            // value for this index has already been returned earlier
            return math.unit(this.distancesReturnedMap.get(index), this.unit);
        }

        if (this.distancesNotYetReturned.length === 0) {
            // all distances values have been randomly picked one time -> restart with all distances values
            this.distancesNotYetReturned = [...this.distances];
        }

        // pick and remove one element of distancesNotYetReturned
        const notYetReturnedIndex: number = createRandomNumber(0, this.distancesNotYetReturned.length);
        const next: number[] = this.distancesNotYetReturned.splice(notYetReturnedIndex, 1);
        assert(next.length === 1, "next.length !== 1");

        // remember picked element
        this.distancesReturnedMap.set(index, next[0]);

        return math.unit(next[0], this.unit);
    }

    public getDescription(): string {
        return `Fixed Distances in random order: ${this.distances} ${this.unit} from ${this.averageShotsGroundTypeEnum}`;
    }
}
