import {
    DrillConfigurationWithFixedDistancesGenerator,
    DrillConfigurationWithRandomDistancesGenerator,
    DrillConfigurationWithRandomFromFixedDistancesGenerator,
    IDrillConfiguration,
    IEndGroundType
} from "./DrillConfiguration";
import {IAverageStrokesData} from "../AverageStrokesData/AverageStrokesData";
import {GroundTypeEnum, StartGroundTypeEnumsType} from "../AverageStrokesData/GroundTypeEnum";

export const RANDOM_DISTANCES_GENERATOR: string = "RandomDistancesGenerator";
export const FIXED_DISTANCES_GENERATOR: string = "FixedDistancesGenerator";
export const RANDOM_FROM_FIXED_DISTANCES_GENERATOR: string = "RandomFromFixedDistancesGenerator";

export const distanceGenerators: string[] = [RANDOM_DISTANCES_GENERATOR, FIXED_DISTANCES_GENERATOR, RANDOM_FROM_FIXED_DISTANCES_GENERATOR];

export const createNewDrillConfigurationWithDistanceGenerator = (
    uuid: string,
    name: string,
    description: string,
    unit: string,
    distanceGenerator: string,
    startGroundType: StartGroundTypeEnumsType,
    endGroundTypes: IEndGroundType[],
    minIncludedDistance: number,
    maxExcludedDistance: number,
    numberOfShots: number,
    distances: number[],
    numberOfRounds: number,
    averageStrokesDataMap: Map<GroundTypeEnum, IAverageStrokesData>
): IDrillConfiguration => {
    switch (distanceGenerator) {
        case RANDOM_DISTANCES_GENERATOR:
            return new DrillConfigurationWithRandomDistancesGenerator(uuid, name, description, unit, startGroundType, endGroundTypes, minIncludedDistance, maxExcludedDistance, numberOfShots, averageStrokesDataMap);
        case FIXED_DISTANCES_GENERATOR:
            return new DrillConfigurationWithFixedDistancesGenerator(uuid, name, description, unit, startGroundType, endGroundTypes, distances, numberOfRounds, averageStrokesDataMap);
        case RANDOM_FROM_FIXED_DISTANCES_GENERATOR:
            return new DrillConfigurationWithRandomFromFixedDistancesGenerator(uuid, name, description, unit, startGroundType, endGroundTypes, distances, numberOfRounds, averageStrokesDataMap);
    }
}
