import {assert} from "chai";
import * as math from "mathjs";
import {Unit} from "mathjs";
import {AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "./AverageStrokesData";

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

/**
 * A DrillConfiguration describes all the parameters of a Drill,
 * for example its name, description, number of shots, the distance generator, ...
 */
export interface IDrillConfiguration {
    getNextDistance: (index: number) => Unit;
    reset: () => void;
    name: string;
    description: string;
    numberOfShots: number;
    unit: string;
    averageShotsStartGroundTypeEnum: AverageStrokesDataGroundTypeEnum;

    computeAverageStrokesFromStartDistance(startDistance: Unit): number;

    computeAverageStrokesFromEndDistance(endDistance: Unit): number | undefined;
}

export const emptyDrillConfiguration : IDrillConfiguration = {
    getNextDistance: (index: number): Unit => math.unit(0, "yards"),
    reset: () => {},
    name: "",
    description: "",
    numberOfShots: 0,
    unit: "yards",
    averageShotsStartGroundTypeEnum: AverageStrokesDataGroundTypeEnum.Fairway,
    computeAverageStrokesFromStartDistance: (startDistance: Unit): 0 => 0,
    computeAverageStrokesFromEndDistance: (endDistance: Unit): number | undefined => undefined,
}
/**
 * Base class for DrillConfigurations below
 */
abstract class AbstractDrillConfiguration {
    protected readonly _name: string;
    protected readonly _description: string;
    protected readonly _averageShotsStartGroundTypeEnum: AverageStrokesDataGroundTypeEnum;
    protected readonly _endGroundTypes: IEndGroundType[];
    protected readonly _averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>;


    private static getEnumKeyByEnumValue<T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | null {
        let keys: string[] = Object.keys(myEnum).filter((x: string): boolean => myEnum[x] == enumValue);
        return keys.length > 0 ? keys[0] : null;
    }

    constructor(
        name: string,
        description: string,
        startGroundType: string,
        endGroundTypes: IEndGroundType[],
        averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>
    ) {
        this._name = name;
        this._description = description;
        this._averageShotsStartGroundTypeEnum =
            AverageStrokesDataGroundTypeEnum[
                AbstractDrillConfiguration.getEnumKeyByEnumValue(AverageStrokesDataGroundTypeEnum, startGroundType)
                ];
        this._endGroundTypes = endGroundTypes;
        this._averageStrokesDataMap = averageStrokesDataMap;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    public computeAverageStrokesFromStartDistance = (startDistance: Unit): number => {
        return this._averageStrokesDataMap?.get(this._averageShotsStartGroundTypeEnum)?.computeAverageStrokesToHole(startDistance);
    }

    public computeAverageStrokesFromEndDistance = (endDistance: Unit): number | undefined => {
        if (!this._averageStrokesDataMap) {
            return 0;
        }
        const averageStrokesData: IAverageStrokesData | undefined = this._averageStrokesDataMap?.get(this._averageShotsStartGroundTypeEnum);
        if (!averageStrokesData) {
            return 0;
        }
        const unit: string = averageStrokesData.unit;
        const endDistanceInUnit: number = endDistance.toNumber(unit);
        console.log("endDistanceInUnit", endDistanceInUnit)

        const greenIncluded: boolean = !!this._endGroundTypes.map((endGroundType: IEndGroundType) => endGroundType.type).find(type => type === AverageStrokesDataGroundTypeEnum.Green);
        console.log("greenIncluded", greenIncluded);
        if (greenIncluded) {
            let matchingEndGroundType: IEndGroundType = undefined;
            for (let i: number = 0; i < this._endGroundTypes.length; i++) {
                const endGroundType: IEndGroundType = this._endGroundTypes[i];
                console.log("endGroundType.to", endGroundType.to);

                const possibleEndGroundType: IEndGroundType =
                    !!endGroundType.to
                        ? endGroundType.to >= endDistanceInUnit
                        ? endGroundType // valid
                        : undefined // invalid
                        : endGroundType; // valid to infinity
                if (!matchingEndGroundType) {
                    console.log("set matchingEndGroundType to ", possibleEndGroundType);
                    matchingEndGroundType = possibleEndGroundType;
                } else if (!possibleEndGroundType) {
                    // endGroundType cannot be used for endDistanceInUnit
                    console.log("possibleEndGroundType cannot be used", possibleEndGroundType);
                } else {
                    // check if we have a better match
                    if (!matchingEndGroundType.to && !possibleEndGroundType.to) {
                        // both have no to -> impossible, configuration is wrong
                        throw new Error("wrong test configuration: more than one endGroundType without to");
                    } else if (!matchingEndGroundType.to && !!possibleEndGroundType.to) {
                        // we have a better match
                        console.log("better match", possibleEndGroundType)
                        matchingEndGroundType = possibleEndGroundType;
                    } else if (!!matchingEndGroundType.to && !possibleEndGroundType.to) {
                        // keep current best match
                        console.log("keep best match", matchingEndGroundType, "and ignore", possibleEndGroundType)
                    } else {
                        // use the better match
                        matchingEndGroundType =
                            matchingEndGroundType.to < possibleEndGroundType.to
                                ? matchingEndGroundType : possibleEndGroundType;
                        console.log("use better match", matchingEndGroundType)
                    }

                }
            }
            if (!matchingEndGroundType) {
                throw new Error(`wrong test configuration: no endGroundType found for distance ${endDistanceInUnit} ${unit}`);
            }
            console.log("final matchingEndGroundType.type", matchingEndGroundType.type)
            if (matchingEndGroundType.type === AverageStrokesDataGroundTypeEnum.OutOfBounds) {
                return undefined;
            }
            return this._averageStrokesDataMap.get(matchingEndGroundType.type)?.computeAverageStrokesToHole(endDistance);
        }

        // CRTODO: !greenIncluded
        return this._averageStrokesDataMap?.get(AverageStrokesDataGroundTypeEnum.Green)?.computeAverageStrokesToHole(endDistance);
    }
}

export interface IEndGroundType {
    type: AverageStrokesDataGroundTypeEnum.Green | AverageStrokesDataGroundTypeEnum.Fairway | AverageStrokesDataGroundTypeEnum.Rough | AverageStrokesDataGroundTypeEnum.OutOfBounds,
    to?: number
}

export class DrillConfigurationWithRandomDistancesGenerator extends AbstractDrillConfiguration implements IDrillConfiguration {
    private readonly _minIncludedDistance: number;
    private readonly _maxExcludedDistance: number;
    private readonly _unit: string;
    private readonly _numberOfShots: number;

    constructor(
        name: string,
        description: string,
        minIncludedDistance: number,
        maxExcludedDistance: number,
        unit: string,
        numberOfShots: number,
        startGroundType: string,
        endGroundTypes: any[],
        averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>
    ) {
        super(name, description, startGroundType, endGroundTypes, averageStrokesDataMap);

        this._minIncludedDistance = minIncludedDistance;
        this._maxExcludedDistance = maxExcludedDistance;
        this._unit = unit;
        this._numberOfShots = numberOfShots;
    }

    reset(): void {
        // nothing to do
    }

    public getNextDistance(index: number): Unit {
        assert(index >= 0, "index < 0");

        return math.unit(createRandomNumber(this._minIncludedDistance, this._maxExcludedDistance), this._unit);
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

export class DrillConfigurationWithFixedDistancesGenerator extends AbstractDrillConfiguration implements IDrillConfiguration {
    protected readonly _distances: number[];
    protected readonly _unit: string;
    protected readonly _numberOfRounds: number;

    constructor(
        name: string,
        description: string,
        distances: number[],
        unit: string,
        numberOfRounds: number,
        startGroundType: string,
        endGroundTypes: any[],
        averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>
    ) {
        super(name, description, startGroundType, endGroundTypes, averageStrokesDataMap);

        this._distances = distances;
        this._unit = unit;
        this._numberOfRounds = numberOfRounds;
    }

    reset(): void {
        // nothing to do
    }

    public getNextDistance(index: number): Unit {
        assert(index >= 0, "index < 0");

        return math.unit(this._distances[index % this._distances.length], this._unit);
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

export class DrillConfigurationWithRandomFromFixedDistancesGenerator extends DrillConfigurationWithFixedDistancesGenerator implements IDrillConfiguration {
    private distancesNotYetReturned: number[];
    private distancesReturnedMap: Map<number, number> = new Map<number, number>();

    constructor(
        name: string,
        description: string,
        distances: number[],
        unit: string,
        numberOfRounds: number,
        startGroundType: string,
        endGroundTypes: any[],
        averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>
    ) {
        super(name, description, distances, unit, numberOfRounds, startGroundType, endGroundTypes, averageStrokesDataMap);
        this.distancesNotYetReturned = [...distances];
    }

    reset(): void {
        this.distancesNotYetReturned = [...this._distances];
        this.distancesReturnedMap = new Map<number, number>()
    }

    public getNextDistance(index: number): Unit {
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
}
