import {
    DrillConfigurationWithFixedDistancesGenerator,
    DrillConfigurationWithRandomDistancesGenerator,
    DrillConfigurationWithRandomFromFixedDistancesGenerator,
    IDrillConfiguration
} from "./DrillConfiguration";
import {AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "../AverageStrokesData";

export const RANDOM_DISTANCES_GENERATOR: string = "RandomDistancesGenerator";
export const FIXED_DISTANCES_GENERATOR: string = "FixedDistancesGenerator";
export const RANDOM_FROM_FIXED_DISTANCES_GENERATOR: string = "RandomFromFixedDistancesGenerator";

export const distanceGenerators: string[] = [RANDOM_DISTANCES_GENERATOR, FIXED_DISTANCES_GENERATOR, RANDOM_FROM_FIXED_DISTANCES_GENERATOR];

export const createNewDrillConfigurationWithDistanceGenerator = (
    drillConfiguration: IDrillConfiguration,
    distanceGenerator: string,
    averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>
): IDrillConfiguration => {
    switch (distanceGenerator) {
        case RANDOM_DISTANCES_GENERATOR:
            return new DrillConfigurationWithRandomDistancesGenerator(
                drillConfiguration.getUuid(),
                drillConfiguration.getName(),
                drillConfiguration.getDescription(),
                0,// drillConfiguration.distanceGenerator.minIncludedDistance,
                10,// drillConfiguration.distanceGenerator.maxExcludedDistance,
                drillConfiguration.getUnit(),
                3,// drillConfiguration.distanceGenerator.numberOfShots,
                drillConfiguration.getStartGroundType(),
                drillConfiguration.endGroundTypes,
                averageStrokesDataMap);
        case FIXED_DISTANCES_GENERATOR:
            return new DrillConfigurationWithFixedDistancesGenerator(
                drillConfiguration.getUuid(),
                drillConfiguration.getName(),
                drillConfiguration.getDescription(),
                [1, 2],// drillConfiguration.distanceGenerator.distances,
                drillConfiguration.getUnit(),
                3,// drillConfiguration.distanceGenerator.numberOfRounds,
                drillConfiguration.getStartGroundType(),
                drillConfiguration.endGroundTypes,
                averageStrokesDataMap);
        case RANDOM_FROM_FIXED_DISTANCES_GENERATOR:
            return new DrillConfigurationWithRandomFromFixedDistancesGenerator(
                drillConfiguration.getUuid(),
                drillConfiguration.getName(),
                drillConfiguration.getDescription(),
                [1, 2],// drillConfiguration.distanceGenerator.distances,
                drillConfiguration.getUnit(),
                3,// drillConfiguration.distanceGenerator.numberOfRounds,
                drillConfiguration.getStartGroundType(),
                drillConfiguration.endGroundTypes,
                averageStrokesDataMap);
    }
}
