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
    reset: () => void;
    getName: () => string;
    getDescription: () => string;
    getNumberOfDistances: () => number;
}

export class RandomDistancesGenerator implements IDistancesGenerator {
    private readonly minIncludedDistance: number;
    private readonly maxExcludedDistance: number;

    constructor(minIncludedDistance: number, maxExcludedDistance: number) {
        this.minIncludedDistance = minIncludedDistance;
        this.maxExcludedDistance = maxExcludedDistance;
    }

    reset(): void {
        // nothing to do
    }

    public getNext(index: number): number {
        assert(index >= 0, "index < 0");

        return createRandomNumber(this.minIncludedDistance, this.maxExcludedDistance);
    }

    public getName(): string {
        return `RD ${this.minIncludedDistance} - ${this.maxExcludedDistance}`;
    }

    public getDescription(): string {
        return `Random Distances between ${this.minIncludedDistance} and ${this.maxExcludedDistance}`;
    }

    getNumberOfDistances(): number {
        return 1;
    }
}

export class FixedDistancesGenerator implements IDistancesGenerator {
    private readonly distances: number[];

    constructor(distances: number[]) {
        this.distances = distances;
    }

    reset(): void {
        // nothing to do
    }

    public getNext(index: number): number {
        assert(index >= 0, "index < 0");

        return this.distances[index % this.distances.length];
    }

    public getName(): string {
        return `FD in FO: ${this.distances}`;
    }

    public getDescription(): string {
        return `Fixed Distances in fixed order: ${this.distances}`;
    }

    getNumberOfDistances(): number {
        return this.distances.length;
    }
}

export class RandomFromFixedDistancesGenerator implements IDistancesGenerator {
    private readonly distances: number[];
    private distancesNotYetReturned: number[];
    private distancesReturnedMap: Map<number, number> = new Map<number, number>();

    constructor(distances: number[]) {
        this.distances = distances;
        this.distancesNotYetReturned = [...distances];
    }

    reset(): void {
        this.distancesNotYetReturned = [...this.distances];
        this.distancesReturnedMap = new Map<number, number>()
    }

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
        return `FR in RO: ${this.distances}`;
    }

    public getDescription(): string {
        return `Fixed Distances in random order: ${this.distances}`;
    }

    getNumberOfDistances(): number {
        return this.distances.length;
    }
}
