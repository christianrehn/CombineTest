import {assert} from "chai";

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
    getNext: (index: number) => number;
    getName: () => string;
}

export class RandomDistancesGenerator implements IDistancesGenerator {
    readonly minIncludedDistance: number;
    readonly maxExcludedDistance: number;

    constructor(minIncludedDistance: number, maxExcludedDistance: number) {
        this.minIncludedDistance = minIncludedDistance;
        this.maxExcludedDistance = maxExcludedDistance;
    }

    public getNext(index: number): number {
        assert(index >= 0, "index < 0");

        return createRandomNumber(this.minIncludedDistance, this.maxExcludedDistance);
    }

    public getName(): string {
        return `Random Distances between ${this.minIncludedDistance} and ${this.maxExcludedDistance}`;
    }
}

export class FixedDistancesGenerator implements IDistancesGenerator {
    readonly distances: number[];

    constructor(distances: number[]) {
        this.distances = distances;
    }

    public getNext(index: number): number {
        assert(index >= 0, "index < 0");

        return this.distances[index % this.distances.length];
    }

    public getName(): string {
        return `Fixed Distances in fixed order: ${this.distances}`;
    }
}

export class RandomFromFixedDistancesGenerator implements IDistancesGenerator {
    readonly distances: number[] = BGV_DISTANCES;
    private distancesNotYetReturned: number[] = [...this.distances];
    private distancesReturnedMap: Map<number, number> = new Map<number, number>();

    public getNext(index: number): number {
        console.log("getNext, index=", index);
        assert(index >= 0, "index < 0");

        if (this.distancesReturnedMap.has(index)) {
            // value for this index has already been returned earlier
            return this.distancesReturnedMap.get(index);
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

        return next[0];
    }

    public getName(): string {
        return `Fixed Distances in random order: ${this.distances}`;
    }
}
