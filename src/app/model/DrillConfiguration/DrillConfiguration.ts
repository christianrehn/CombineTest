import {assert} from "chai";
import * as math from "mathjs";
import {Unit} from "mathjs";
import {IAverageStrokesData} from "../AverageStrokesData/AverageStrokesData";
import {v4 as uuidv4} from 'uuid';
import {Fairway, Green, OutOfBounds,} from "../AverageStrokesData/GroundType";
import {
    FIXED_DISTANCES_GENERATOR,
    RANDOM_DISTANCES_GENERATOR,
    RANDOM_FROM_FIXED_DISTANCES_GENERATOR
} from "./DistanceGenerator";
import {trackmanScoreAndShotsGainedDrillType} from "../SelectValues/DrillType";
import {meterLengthUnit} from "../SelectValues/LengthUnit";
import {Entity, IEntity} from "../base/Entity";

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
export interface IDrillConfiguration extends IEntity {
    getName: () => string;
    getDescription: () => string;
    getDrillType: () => string;
    getUnit: () => string;
    getTargetSpinInRpmPerUnit: () => number;
    getMaxDeviationAsUnitNotPercent: () => boolean;
    getMaxDeviationInUnit: () => number;
    getMaxDeviationInPercent: () => number;
    getTargetCircleRadiusAsUnitNotPercent: () => boolean;
    getTargetCircleRadiusScore100InUnit: () => number;
    getTargetCircleRadiusScore0InUnit: () => number;
    getTargetCircleRadiusScore100InPercent: () => number;
    getTargetCircleRadiusScore0InPercent: () => number;
    getStartGroundType: () => string;
    getEndGroundConfigs: () => IEndGroundConfig[]
    getDistanceGenerator: () => string;
    getNumberOfShots: () => number;
    getNextDistance: (index: number) => Unit;
    reset: () => void;
    computeAverageStrokesFromStartDistance: (startDistance: Unit) => number;
    computeAverageStrokesFromEndDistance: (endDistance: Unit) => number | undefined;
}

export interface IRandomDistancesGenerator {
    getMinIncludedDistance: () => number
    getMaxExcludedDistance: () => number
    getNumberOfShots: () => number;
}

export interface IFixedDistancesGenerator {
    getDistances: () => number[]
    getNumberOfRounds: () => number
}

/**
 * Base class for DrillConfigurations below
 */
abstract class AbstractDrillConfiguration extends Entity {
    protected _name: string;
    protected _description: string;
    protected _drillType: string;
    protected _targetSpinInRpmPerUnit: number;
    protected _maxDeviationAsUnitNotPercent: boolean;
    protected _maxDeviationInUnit: number;
    protected _maxDeviationInPercent: number;
    protected _targetCircleRadiusAsUnitNotPercent: boolean;
    protected _targetCircleRadiusScore100InUnit: number;
    protected _targetCircleRadiusScore0InUnit: number;
    protected _targetCircleRadiusScore100InPercent: number;
    protected _targetCircleRadiusScore0InPercent: number;
    protected _startGroundType: string;
    protected _endGroundConfigs: IEndGroundConfig[];
    protected readonly _averageShotsStartGroundType: string;
    protected readonly _averageStrokesDataMap: Map<string, IAverageStrokesData>;

    constructor(
        uuid: string,
        name: string,
        description: string,
        drillType: string,
        targetSpinInRpmPerUnit: number,
        maxDeviationAsUnitNotPercent: boolean,
        maxDeviationInUnit: number,
        maxDeviationInPercent: number,
        targetCircleRadiusAsUnitNotPercent: boolean,
        targetCircleRadiusScore100InUnit: number,
        targetCircleRadiusScore0InUnit: number,
        targetCircleRadiusScore100InPercent: number,
        targetCircleRadiusScore0InPercent: number,
        startGroundType: string,
        endGroundConfigs: IEndGroundConfig[],
        averageStrokesDataMap: Map<string, IAverageStrokesData>,
    ) {
        super(uuid);

        this._name = name;
        this._description = description;
        this._drillType = drillType;
        this._targetSpinInRpmPerUnit = targetSpinInRpmPerUnit;
        this._maxDeviationAsUnitNotPercent = maxDeviationAsUnitNotPercent;
        this._maxDeviationInUnit = maxDeviationInUnit;
        this._maxDeviationInPercent = maxDeviationInPercent;
        this._targetCircleRadiusAsUnitNotPercent = targetCircleRadiusAsUnitNotPercent;
        this._targetCircleRadiusScore100InUnit = targetCircleRadiusScore100InUnit;
        this._targetCircleRadiusScore0InUnit = targetCircleRadiusScore0InUnit;
        this._targetCircleRadiusScore100InPercent = targetCircleRadiusScore100InPercent;
        this._targetCircleRadiusScore0InPercent = targetCircleRadiusScore0InPercent;
        this._startGroundType = startGroundType;
        this._endGroundConfigs = endGroundConfigs;
        this._averageShotsStartGroundType = startGroundType;
        this._averageStrokesDataMap = averageStrokesDataMap;
    }

    public getName = (): string => {
        return this._name;
    }

    public getDescription = (): string => {
        return this._description;
    }
    public getDrillType = (): string => {
        return this._drillType;
    }

    public getTargetSpinInRpmPerUnit = (): number => {
        return this._targetSpinInRpmPerUnit;
    }

    public getMaxDeviationAsUnitNotPercent = (): boolean => {
        return this._maxDeviationAsUnitNotPercent;
    }

    public getMaxDeviationInUnit = (): number => {
        return this._maxDeviationInUnit;
    }

    public getMaxDeviationInPercent = (): number => {
        return this._maxDeviationInPercent;
    }

    public getTargetCircleRadiusAsUnitNotPercent = (): boolean => {
        return this._targetCircleRadiusAsUnitNotPercent;
    }

    public getTargetCircleRadiusScore100InUnit = (): number => {
        return this._targetCircleRadiusScore100InUnit;
    }

    public getTargetCircleRadiusScore0InUnit = (): number => {
        return this._targetCircleRadiusScore0InUnit;
    }

    public getTargetCircleRadiusScore100InPercent = (): number => {
        return this._targetCircleRadiusScore100InPercent;
    }

    public getTargetCircleRadiusScore0InPercent = (): number => {
        return this._targetCircleRadiusScore0InPercent;
    }

    public getStartGroundType = (): string => {
        return this._startGroundType;
    }

    public getEndGroundConfigs = (): IEndGroundConfig[] => {
        return this._endGroundConfigs;
    }

    public computeAverageStrokesFromStartDistance = (startDistance: Unit): number => {
        const averageStrokesFromStartDistance: number = this._averageStrokesDataMap?.get(this._averageShotsStartGroundType)?.computeAverageStrokesToHole(startDistance);
        console.log("computeAverageStrokesFromStartDistance - this._averageShotsStartGroundType=", this._averageShotsStartGroundType);
        console.log("computeAverageStrokesFromStartDistance - averageStrokesFromStartDistance=", averageStrokesFromStartDistance);
        return averageStrokesFromStartDistance;
    }

    public computeAverageStrokesFromEndDistance = (endDistance: Unit): number | undefined => {
        if (!this._averageStrokesDataMap) {
            return 0;
        }

        const averageStrokesData: IAverageStrokesData | undefined = this._averageStrokesDataMap?.get(this._averageShotsStartGroundType);
        console.log("computeAverageStrokesFromEndDistance - averageStrokesData=", averageStrokesData);
        if (!averageStrokesData) {
            return 0;
        }
        const unit: string = averageStrokesData.unit;
        const endDistanceInUnit: number = endDistance.toNumber(unit);

        // check if one of the endGroundConfigs in the configuration is Green
        const endGroundConfigs: string[] = this._endGroundConfigs.map((endGroundConfig: IEndGroundConfig) => endGroundConfig.type);
        const greenIncluded: boolean = !!endGroundConfigs.find((type: string): boolean => type.toString() === Green);
        console.log("computeAverageStrokesFromEndDistance - greenIncluded=", greenIncluded);
        if (greenIncluded) {
            console.log("computeAverageStrokesFromEndDistance - endDistanceInUnit=", endDistanceInUnit);
            // there might be also other endGroundConfigs but Green is one of the endGroundConfigs in the configuration
            // -> find the endGroundConfig that matches the current distance to the hole
            let matchingEndGroundConfig: IEndGroundConfig = undefined;
            for (let i: number = 0; i < this._endGroundConfigs.length; i++) {
                const endGroundConfig: IEndGroundConfig = this._endGroundConfigs[i];
                console.log("endGroundConfig.to", endGroundConfig.to);

                const possibleEndGroundConfig: IEndGroundConfig =
                    !!endGroundConfig.to
                        ? endGroundConfig.to >= endDistanceInUnit
                            ? endGroundConfig // valid
                            : undefined // invalid
                        : endGroundConfig; // valid to infinity
                if (!matchingEndGroundConfig) {
                    console.log("set possibleEndGroundConfig to ", possibleEndGroundConfig);
                    matchingEndGroundConfig = possibleEndGroundConfig;
                } else if (!possibleEndGroundConfig) {
                    // endGroundConfig cannot be used for endDistanceInUnit
                    console.log("possibleEndGroundConfig cannot be used", possibleEndGroundConfig);
                } else {
                    // check if we have a better match
                    if (!matchingEndGroundConfig.to && !possibleEndGroundConfig.to) {
                        // both have no to -> impossible, configuration is wrong
                        throw new Error("wrong test configuration: more than one endGroundConfig without to");
                    } else if (!matchingEndGroundConfig.to && !!possibleEndGroundConfig.to) {
                        // we have a better match
                        console.log("better match", possibleEndGroundConfig)
                        matchingEndGroundConfig = possibleEndGroundConfig;
                    } else if (!!matchingEndGroundConfig.to && !possibleEndGroundConfig.to) {
                        // keep current best match
                        console.log("keep best match", matchingEndGroundConfig, "and ignore", possibleEndGroundConfig)
                    } else {
                        // use the better match
                        matchingEndGroundConfig =
                            matchingEndGroundConfig.to < possibleEndGroundConfig.to
                                ? matchingEndGroundConfig : possibleEndGroundConfig;
                        console.log("use better match", matchingEndGroundConfig)
                    }

                }
            }
            if (!matchingEndGroundConfig) {
                throw new Error(`wrong test configuration: no endGroundConfig found for distance ${endDistanceInUnit} ${unit}`);
            }
            console.log("final matchingEndGroundConfig.type", matchingEndGroundConfig.type)
            if (matchingEndGroundConfig.type === OutOfBounds) {
                return undefined;
            }
            return this._averageStrokesDataMap.get(matchingEndGroundConfig.type)?.computeAverageStrokesToHole(endDistance);
        }

        // CRTODO: case !greenIncluded is not implementes -> use green as end ground type
        return this._averageStrokesDataMap?.get(Green)?.computeAverageStrokesToHole(endDistance);
    }
}

export interface IEndGroundConfig {
    type: string,
    to?: number // = radius = distance to hole
}

export class DrillConfigurationWithRandomDistancesGenerator extends AbstractDrillConfiguration implements IDrillConfiguration, IRandomDistancesGenerator {
    private readonly _minIncludedDistance: number;
    private readonly _maxExcludedDistance: number;
    private _unit: string;
    private readonly _numberOfShots: number;

    constructor(
        uuid: string,
        name: string,
        description: string,
        drillType: string,
        unit: string,
        targetSpinInRpmPerUnit: number,
        maxDeviationAsUnitNotPercent: boolean,
        maxDeviationInUnit: number,
        maxDeviationInPercent: number,
        targetCircleRadiusAsUnitNotPercent: boolean,
        targetCircleRadiusScore100InUnit: number,
        targetCircleRadiusScore0InUnit: number,
        targetCircleRadiusScore100InPercent: number,
        targetCircleRadiusScore0InPercent: number,
        startGroundType: string,
        endGroundConfigs: IEndGroundConfig[],
        minIncludedDistance: number,
        maxExcludedDistance: number,
        numberOfShots: number,
        averageStrokesDataMap: Map<string, IAverageStrokesData>
    ) {
        super(
            uuid,
            name,
            description,
            drillType,
            targetSpinInRpmPerUnit,
            maxDeviationAsUnitNotPercent,
            maxDeviationInUnit,
            maxDeviationInPercent,
            targetCircleRadiusAsUnitNotPercent,
            targetCircleRadiusScore100InUnit,
            targetCircleRadiusScore0InUnit,
            targetCircleRadiusScore100InPercent,
            targetCircleRadiusScore0InPercent,
            startGroundType,
            endGroundConfigs,
            averageStrokesDataMap);

        this._minIncludedDistance = minIncludedDistance;
        this._maxExcludedDistance = maxExcludedDistance;
        this._unit = unit;
        this._numberOfShots = numberOfShots;
    }

    public reset(): void {
        // nothing to do
    }

    public getDistanceGenerator(): string {
        return RANDOM_DISTANCES_GENERATOR;
    }

    public getMinIncludedDistance(): number {
        return this._minIncludedDistance;
    }

    public getMaxExcludedDistance(): number {
        return this._maxExcludedDistance;
    }

    public getNextDistance(index: number): Unit {
        assert(index >= 0, "index < 0");

        return math.unit(createRandomNumber(this._minIncludedDistance, this._maxExcludedDistance), this._unit);
    }

    public getNumberOfShots = (): number => {
        return this._numberOfShots;
    }

    public getUnit = (): string => {
        return this._unit;
    }

    public toJson = (): any => {
        return {
            uuid: this.getUuid(),
            name: this.getName(),
            description: this.getDescription(),
            drillType: this.getDrillType(),
            unit: this.getUnit(),
            targetSpinInRpmPerUnit: this.getTargetSpinInRpmPerUnit(),
            maxDeviationAsUnitNotPercent: this.getMaxDeviationAsUnitNotPercent(),
            maxDeviationInUnit: this.getMaxDeviationInUnit(),
            maxDeviationInPercent: this.getMaxDeviationInPercent(),
            targetCircleRadiusAsUnitNotPercent: this.getTargetCircleRadiusAsUnitNotPercent(),
            targetCircleRadiusScore100InUnit: this.getTargetCircleRadiusScore100InUnit(),
            targetCircleRadiusScore0InUnit: this.getTargetCircleRadiusScore0InUnit(),
            targetCircleRadiusScore100InPercent: this.getTargetCircleRadiusScore100InPercent(),
            targetCircleRadiusScore0InPercent: this.getTargetCircleRadiusScore0InPercent(),
            distanceGenerator: {
                minIncludedDistance: this._minIncludedDistance,
                maxExcludedDistance: this._maxExcludedDistance,
                numberOfShots: this._numberOfShots
            },
            startGroundType: this._startGroundType,
            endGroundConfigs: this._endGroundConfigs,
        }
    }
}

export class DrillConfigurationWithFixedDistancesGenerator extends AbstractDrillConfiguration implements IDrillConfiguration, IFixedDistancesGenerator {
    protected readonly _distances: number[];
    protected readonly _unit: string;
    protected readonly _numberOfRounds: number;

    public constructor(
        uuid: string,
        name: string,
        description: string,
        drillType: string,
        unit: string,
        targetSpinInRpmPerUnit: number,
        maxDeviationAsUnitNotPercent: boolean,
        maxDeviationInUnit: number,
        maxDeviationInPercent: number,
        targetCircleRadiusAsUnitNotPercent: boolean,
        targetCircleRadiusScore100InUnit: number,
        targetCircleRadiusScore0InUnit: number,
        targetCircleRadiusScore100InPercent: number,
        targetCircleRadiusScore0InPercent: number,
        startGroundType: string,
        endGroundConfigs: IEndGroundConfig[],
        distances: number[],
        numberOfRounds: number,
        averageStrokesDataMap: Map<string, IAverageStrokesData>,
    ) {
        super(
            uuid,
            name,
            description,
            drillType,
            targetSpinInRpmPerUnit,
            maxDeviationAsUnitNotPercent,
            maxDeviationInUnit,
            maxDeviationInPercent,
            targetCircleRadiusAsUnitNotPercent,
            targetCircleRadiusScore100InUnit,
            targetCircleRadiusScore0InUnit,
            targetCircleRadiusScore100InPercent,
            targetCircleRadiusScore0InPercent,
            startGroundType,
            endGroundConfigs,
            averageStrokesDataMap);

        this._distances = distances;
        this._unit = unit;
        this._numberOfRounds = numberOfRounds;
    }

    public getDistanceGenerator(): string {
        return FIXED_DISTANCES_GENERATOR;
    }

    public getDistances(): number[] {
        return this._distances;
    }

    public getNumberOfRounds(): number {
        return this._numberOfRounds;
    }

    public reset(): void {
        // nothing to do
    }

    public getNextDistance(index: number): Unit {
        assert(index >= 0, "index < 0");

        return math.unit(this._distances[index % this._distances.length], this._unit);
    }

    public getNumberOfShots = (): number => {
        return this._distances.length * this._numberOfRounds;
    }

    public getUnit = (): string => {
        return this._unit;
    }

    protected toJsonHelper(distanceGeneratorType: string): any {
        return {
            uuid: this.getUuid(),
            name: this.getName(),
            description: this.getDescription(),
            drillType: this.getDrillType(),
            unit: this.getUnit(),
            targetSpinInRpmPerUnit: this.getTargetSpinInRpmPerUnit(),
            maxDeviationAsUnitNotPercent: this.getMaxDeviationAsUnitNotPercent(),
            maxDeviationInUnit: this.getMaxDeviationInUnit(),
            maxDeviationInPercent: this.getMaxDeviationInPercent(),
            targetCircleRadiusAsUnitNotPercent: this.getTargetCircleRadiusAsUnitNotPercent(),
            targetCircleRadiusScore100InUnit: this.getTargetCircleRadiusScore100InUnit(),
            targetCircleRadiusScore0InUnit: this.getTargetCircleRadiusScore0InUnit(),
            targetCircleRadiusScore100InPercent: this.getTargetCircleRadiusScore100InPercent(),
            targetCircleRadiusScore0InPercent: this.getTargetCircleRadiusScore0InPercent(),
            distanceGenerator: {
                type: distanceGeneratorType,
                distances: this._distances,
                numberOfRounds: this._numberOfRounds
            },
            startGroundType: this._startGroundType,
            endGroundConfigs: this._endGroundConfigs,
        }
    }

    public toJson = (): any => {
        return this.toJsonHelper("FixedDistancesGenerator");
    }
}

export class DrillConfigurationWithRandomFromFixedDistancesGenerator extends DrillConfigurationWithFixedDistancesGenerator implements IDrillConfiguration, IFixedDistancesGenerator {
    private distancesNotYetReturned: number[];
    private distancesReturnedMap: Map<number, number> = new Map<number, number>();

    constructor(
        uuid: string,
        name: string,
        description: string,
        drillType: string,
        unit: string,
        targetSpinInRpmPerUnit: number,
        maxDeviationAsUnitNotPercent: boolean,
        maxDeviationInUnit: number,
        maxDeviationInPercent: number,
        targetCircleRadiusAsUnitNotPercent: boolean,
        targetCircleRadiusScore100InUnit: number,
        targetCircleRadiusScore0InUnit: number,
        targetCircleRadiusScore100InPercent: number,
        targetCircleRadiusScore0InPercent: number,
        startGroundType: string,
        endGroundConfigs: IEndGroundConfig[],
        distances: number[],
        numberOfRounds: number,
        averageStrokesDataMap: Map<string, IAverageStrokesData>
    ) {
        super(
            uuid,
            name,
            description,
            drillType,
            unit,
            targetSpinInRpmPerUnit,
            maxDeviationAsUnitNotPercent,
            maxDeviationInUnit,
            maxDeviationInPercent,
            targetCircleRadiusAsUnitNotPercent,
            targetCircleRadiusScore100InUnit,
            targetCircleRadiusScore0InUnit,
            targetCircleRadiusScore100InPercent,
            targetCircleRadiusScore0InPercent,
            startGroundType,
            endGroundConfigs,
            distances,
            numberOfRounds,
            averageStrokesDataMap);
        this.distancesNotYetReturned = [...distances];
    }

    public getDistanceGenerator(): string {
        return RANDOM_FROM_FIXED_DISTANCES_GENERATOR;
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

export class EmptyDrillConfiguration extends DrillConfigurationWithFixedDistancesGenerator implements IDrillConfiguration, IFixedDistancesGenerator {
    constructor(
        averageStrokesDataMap: Map<string, IAverageStrokesData>
    ) {
        super(
            uuidv4(),
            "",
            "",
            trackmanScoreAndShotsGainedDrillType,
            meterLengthUnit,
            0,
            true,
            0,
            0,
            true,
            0,
            0,
            0,
            0,
            Fairway,
            [{type: Green, to: 5}, {type: Fairway}],
            [],
            1,
            averageStrokesDataMap
        );
    }
}
