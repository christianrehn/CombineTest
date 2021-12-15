import {Unit} from "mathjs";
import {linear} from "everpolate";
import {GroundTypeEnum} from "./GroundTypeEnum";

export interface IAverageStrokesData {
    averageStrokesDataGroundTypeEnum: GroundTypeEnum;
    unit: string;
    distances: number[];
    strokes: number[];
    computeAverageStrokesToHole: (distance: Unit) => number;
}

export class AverageStrokesData implements IAverageStrokesData {
    private readonly _averageStrokesDataGroundTypeEnum: GroundTypeEnum;
    private readonly _unit: string;
    private readonly _distances: number[];
    private readonly _strokes: number[];

    constructor(averageStrokesDataGroundTypeEnum: GroundTypeEnum, distances: number[], unit: string, strokes: number[]) {
        this._unit = unit;
        this._distances = distances;
        this._strokes = strokes;
        this._averageStrokesDataGroundTypeEnum = averageStrokesDataGroundTypeEnum;
    }


    get averageStrokesDataGroundTypeEnum(): GroundTypeEnum {
        return this._averageStrokesDataGroundTypeEnum;
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

    public computeAverageStrokesToHole = (
        distance: Unit,
    ): number => {
        const distanceInAverageShotsUnit: number =
            !!distance
                ? distance.toNumber(this.unit)
                : undefined;
        const averageStrokesFromDistance: number = !!distanceInAverageShotsUnit
            ? linear(distanceInAverageShotsUnit, this.distances, this.strokes)[0]
            : undefined;
        return averageStrokesFromDistance;
    }
}
