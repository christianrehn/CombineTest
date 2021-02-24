import {assert} from "chai";

/**
 * Create random number between [min, max[.
 */
const createRandomNumber = (min: number, max: number): number => {
    assert(min <= max, "min > max");

    if (min === max) {
        return min;
    }

    return Math.floor(Math.random() * Math.floor(max - min)) + min;
}

export interface IDistances {
    getNext: (index: number) => number;
}

export class RandomDistances implements IDistances {
    readonly minDistance: number = 10;
    readonly maxDistance: number = 60;


    public getNext(index: number): number {
        assert(index >= 0, "index < 0");

        return createRandomNumber(this.minDistance, this.maxDistance);
    }
}

export class FixedDistances implements IDistances {
    readonly distances: number[] = [10, 20, 30];

    public getNext(index: number): number {
        assert(index >= 0, "index < 0");

        return this.distances[index % this.distances.length];
    }
}

export class RandomFromFixedDistances implements IDistances {
    readonly distances: number[] = [10, 20, 30, 40];
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
        const notYetReturnedIndex: number = createRandomNumber(0, this.distancesNotYetReturned.length - 1);
        const next: number[] = this.distancesNotYetReturned.splice(notYetReturnedIndex, 1);
        console.log("this.distancesNotYetReturned after", this.distancesNotYetReturned);
        assert(next.length === 1, "next.length !== 1");

        // remember picked element
        this.distancesReturnedMap.set(index, next[0]);

        return next[0];
    }
}
