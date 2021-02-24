import {assert} from "chai";

export interface IDistances {
    getNext: () => number;
}

export class RandomDistances implements IDistances {
    readonly minDistance: number = 10;
    readonly maxDistance: number = 60;

    /**
     * Create random number between [min, max[.
     */
    private createRandomNumber(min: number, max: number): number {
        assert(min < max, "min >= max");

        return Math.floor(Math.random() * Math.floor(max - min)) + min;
    }

    public getNext(): number {
        return this.createRandomNumber(this.minDistance, this.maxDistance);
    }

}
