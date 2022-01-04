import {
    DrillConfigurationWithFixedDistancesGenerator,
    DrillConfigurationWithRandomDistancesGenerator,
    DrillConfigurationWithRandomFromFixedDistancesGenerator,
    IDrillConfiguration,
    IEndGroundConfig
} from "./DrillConfiguration";
import {IAverageStrokesData} from "../AverageStrokesData/AverageStrokesData";

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
    startGroundType: string,
    endGroundConfigs: IEndGroundConfig[],
    minIncludedDistance: number,
    maxExcludedDistance: number,
    numberOfShots: number,
    distances: number[],
    numberOfRounds: number,
    averageStrokesDataMap: Map<string, IAverageStrokesData>
): IDrillConfiguration => {
    switch (distanceGenerator) {
        case RANDOM_DISTANCES_GENERATOR:
            return new DrillConfigurationWithRandomDistancesGenerator(uuid, name, description, unit, startGroundType, endGroundConfigs, minIncludedDistance, maxExcludedDistance, numberOfShots, averageStrokesDataMap);
        case FIXED_DISTANCES_GENERATOR:
            return new DrillConfigurationWithFixedDistancesGenerator(uuid, name, description, unit, startGroundType, endGroundConfigs, distances, numberOfRounds, averageStrokesDataMap);
        case RANDOM_FROM_FIXED_DISTANCES_GENERATOR:
            return new DrillConfigurationWithRandomFromFixedDistancesGenerator(uuid, name, description, unit, startGroundType, endGroundConfigs, distances, numberOfRounds, averageStrokesDataMap);
    }
}
