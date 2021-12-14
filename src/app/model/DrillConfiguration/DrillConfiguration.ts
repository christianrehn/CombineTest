import {assert} from "chai";
import * as math from "mathjs";
import {Unit} from "mathjs";
import {AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "../AverageStrokesData";
import {v4 as uuidv4} from 'uuid';

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
 *
 * HINT: setter and getter implementations of base class were not called through the interface -> changed to get.../set... methods
 */
export interface IDrillConfiguration {
    getUuid: () => string;
    setUuid: (uuid: string) => void;
    getName: () => string;
    setName: (name: string) => void;
    getDescription: () => string;
    setDescription: (description: string) => void;
    getUnit: () => string;
    setUnit: (unit: string) => void;
    numberOfShots: number;
    startGroundType: string;
    endGroundTypes: IEndGroundType[]
    averageShotsStartGroundTypeEnum: AverageStrokesDataGroundTypeEnum;
    getNextDistance: (index: number) => Unit;
    reset: () => void;
    computeAverageStrokesFromStartDistance: (startDistance: Unit) => number;
    computeAverageStrokesFromEndDistance: (endDistance: Unit) => number | undefined;
    toJson: () => any;
}

/**
 * Base class for DrillConfigurations below
 */
abstract class AbstractDrillConfiguration {
    protected _uuid: string;
    protected _name: string;
    protected _description: string;
    protected _startGroundType: string;
    protected readonly _endGroundTypes: IEndGroundType[];
    protected readonly _averageShotsStartGroundTypeEnum: AverageStrokesDataGroundTypeEnum;
    protected readonly _averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>;

    private static getEnumKeyByEnumValue<T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | null {
        let keys: string[] = Object.keys(myEnum).filter((x: string): boolean => myEnum[x] == enumValue);
        return keys.length > 0 ? keys[0] : null;
    }

    constructor(
        uuid: string,
        name: string,
        description: string,
        startGroundType: string,
        endGroundTypes: IEndGroundType[],
        averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>,
    ) {
        this._uuid = uuid;
        this._name = name;
        this._description = description;
        this._startGroundType = startGroundType;
        this._endGroundTypes = endGroundTypes;
        this._averageShotsStartGroundTypeEnum =
            AverageStrokesDataGroundTypeEnum[
                AbstractDrillConfiguration.getEnumKeyByEnumValue(AverageStrokesDataGroundTypeEnum, startGroundType)
                ];
        this._averageStrokesDataMap = averageStrokesDataMap;
    }

    public getUuid = (): string => {
        return this._uuid;
    }

    public setUuid = (uuid: string): void => {
        this._uuid = uuid;
    }

    public getName = (): string => {
        return this._name;
    }

    public setName = (name: string): void => {
        this._name = name;
    }

    public getDescription = (): string => {
        return this._description;
    }

    public setDescription = (description: string): void => {
        this._description = description;
    }

    get startGroundType(): string {
        return this._startGroundType;
    }

    get endGroundTypes(): IEndGroundType[] {
        return this._endGroundTypes;
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
    private _unit: string;
    private readonly _numberOfShots: number;

    constructor(
        uuid: string,
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
        super(uuid, name, description, startGroundType, endGroundTypes, averageStrokesDataMap);

        this._minIncludedDistance = minIncludedDistance;
        this._maxExcludedDistance = maxExcludedDistance;
        this._unit = unit;
        this._numberOfShots = numberOfShots;
    }

    public reset(): void {
        // nothing to do
    }

    public getNextDistance(index: number): Unit {
        assert(index >= 0, "index < 0");

        return math.unit(createRandomNumber(this._minIncludedDistance, this._maxExcludedDistance), this._unit);
    }

    get numberOfShots(): number {
        return this._numberOfShots;
    }

    public getUnit = (): string => {
        return this._unit;
    }

    public setUnit = (unit: string): void => {
        this._unit = unit;
    }

    get averageShotsStartGroundTypeEnum(): AverageStrokesDataGroundTypeEnum {
        return this._averageShotsStartGroundTypeEnum;
    }

    public toJson = (): any => {
        return {
            uuid: this.getUnit(),
            name: this.getName(),
            description: this.getDescription(),
            unit: this.getUnit(),
            distanceGenerator: {
                minIncludedDistance: this._minIncludedDistance,
                maxExcludedDistance: this._maxExcludedDistance,
                numberOfShots: this._numberOfShots
            },
            startGroundType: this._startGroundType,
            endGroundTypes: this._endGroundTypes,
        }
    }
}

export class DrillConfigurationWithFixedDistancesGenerator extends AbstractDrillConfiguration implements IDrillConfiguration {
    protected readonly _distances: number[];
    protected _unit: string;
    protected readonly _numberOfRounds: number;

    public constructor(
        uuid: string,
        name: string,
        description: string,
        distances: number[],
        unit: string,
        numberOfRounds: number,
        startGroundType: string,
        endGroundTypes: IEndGroundType[],
        averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>,
    ) {
        super(
            uuid,
            name,
            description,
            startGroundType,
            endGroundTypes,
            averageStrokesDataMap);

        this._distances = distances;
        this._unit = unit;
        this._numberOfRounds = numberOfRounds;
    }

    public reset(): void {
        // nothing to do
    }

    public getNextDistance(index: number): Unit {
        assert(index >= 0, "index < 0");

        return math.unit(this._distances[index % this._distances.length], this._unit);
    }

    get numberOfShots(): number {
        return this._distances.length * this._numberOfRounds;
    }

    public getUnit = (): string => {
        return this._unit;
    }

    public setUnit = (unit: string): void => {
        this._unit = unit;
    }

    get averageShotsStartGroundTypeEnum(): AverageStrokesDataGroundTypeEnum {
        return this._averageShotsStartGroundTypeEnum;
    }

    protected toJsonHelper(distanceGeneratorType: string): any {
        return {
            uuid: this.getUnit(),
            name: this.getName(),
            description: this.getDescription(),
            unit: this.getUnit(),
            distanceGenerator: {
                type: distanceGeneratorType,
                distances: this._distances,
                numberOfRounds: this._numberOfRounds
            },
            startGroundType: this._startGroundType,
            endGroundTypes: this._endGroundTypes,
        }
    }

    public toJson = (): any => {
        return this.toJsonHelper("FixedDistancesGenerator");
    }
}

export class DrillConfigurationWithRandomFromFixedDistancesGenerator extends DrillConfigurationWithFixedDistancesGenerator implements IDrillConfiguration {
    private distancesNotYetReturned: number[];
    private distancesReturnedMap: Map<number, number> = new Map<number, number>();

    constructor(
        uuid: string,
        name: string,
        description: string,
        distances: number[],
        unit: string,
        numberOfRounds: number,
        startGroundType: string,
        endGroundTypes: IEndGroundType[],
        averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>
    ) {
        super(uuid, name, description, distances, unit, numberOfRounds, startGroundType, endGroundTypes, averageStrokesDataMap);
        this.distancesNotYetReturned = [...distances];
    }

    public reset(): void {
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

    public toJson = (): any => {
        return this.toJsonHelper("RandomFromFixedDistancesGenerator");
    }
}

export class EmptyDrillConfiguration extends DrillConfigurationWithFixedDistancesGenerator implements IDrillConfiguration {
    constructor(
        averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>
    ) {
        console.log("uuidv4()", uuidv4())
        super(uuidv4(), "", "", [], "meter", 1, AverageStrokesDataGroundTypeEnum.Fairway, [], averageStrokesDataMap);
    }
}
