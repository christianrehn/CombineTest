import {assert} from "chai";
import {Unit} from "mathjs";
import * as math from 'mathjs'

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

    getUnit(): string;
}

export class RandomDistancesGenerator implements IDistancesGenerator {
    private readonly minIncludedDistance: number;
    private readonly maxExcludedDistance: number;
    private readonly unit: string;

    constructor(minIncludedDistance: number, maxExcludedDistance: number, unit: string) {
        this.minIncludedDistance = minIncludedDistance;
        this.maxExcludedDistance = maxExcludedDistance;
        this.unit = unit;
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
        return `Random Distances between ${this.minIncludedDistance} and ${this.maxExcludedDistance} ${this.unit}`;
    }

    getNumberOfDistances(): number {
        return 1;
    }

    getUnit(): string {
        return this.unit;
    }
}

export class FixedDistancesGenerator implements IDistancesGenerator {
    private readonly distances: number[];
    private readonly unit: string;

    constructor(distances: number[], unit: string) {
        this.distances = distances;
        this.unit = unit;
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
        return `Fixed Distances in fixed order: ${this.distances} ${this.unit}`;
    }

    getNumberOfDistances(): number {
        return this.distances.length;
    }

    getUnit(): string {
        return this.unit;
    }
}

export class RandomFromFixedDistancesGenerator implements IDistancesGenerator {
    private readonly distances: number[];
    private distancesNotYetReturned: number[];
    private distancesReturnedMap: Map<number, number> = new Map<number, number>();
    private readonly unit: string;

    constructor(distances: number[], unit: string) {
        this.distances = distances;
        this.distancesNotYetReturned = [...distances];
        this.unit = unit;
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
        console.log("this.distancesNotYetReturned before", this.distancesNotYetReturned);
        const notYetReturnedIndex: number = createRandomNumber(0, this.distancesNotYetReturned.length);
        const next: number[] = this.distancesNotYetReturned.splice(notYetReturnedIndex, 1);
        console.log("this.distancesNotYetReturned after", this.distancesNotYetReturned);
        assert(next.length === 1, "next.length !== 1");

        // remember picked element
        this.distancesReturnedMap.set(index, next[0]);

        return math.unit(next[0], this.unit);
    }

    public getName(): string {
        return this.getDescription();
    }

    public getDescription(): string {
        return `Fixed Distances in random order: ${this.distances} ${this.unit}`;
    }

    getNumberOfDistances(): number {
        return this.distances.length;
    }

    getUnit(): string {
        return this.unit;
    }
}
