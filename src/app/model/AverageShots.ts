export interface IAverageShots {
    averageShotsGroundTypeEnum: AverageShotsGroundTypeEnum;
    unit: string;
    distances: number[];
    strokes: number[];
}

export enum AverageShotsGroundTypeEnum {
    Tee = 'Tee',
    Fairway = 'Fairway',
    Green = 'Green',
}

export class AverageShots implements IAverageShots {
    private readonly _averageShotsGroundTypeEnum: AverageShotsGroundTypeEnum;
    private readonly _unit: string;
    private readonly _distances: number[];
    private readonly _strokes: number[];

    constructor(averageShotsGroundTypeEnum: AverageShotsGroundTypeEnum, distances: number[], unit: string, strokes: number[]) {
        this._unit = unit;
        this._distances = distances;
        this._strokes = strokes;
        this._averageShotsGroundTypeEnum = averageShotsGroundTypeEnum;
    }


    get averageShotsGroundTypeEnum(): AverageShotsGroundTypeEnum {
        return this._averageShotsGroundTypeEnum;
    }

    get unit(): string {
        return this._unit;
    }

    get distances(): number[] {
        return this._distances;
    }

    get strokes(): number[] {
        return this._strokes;
    }

}
