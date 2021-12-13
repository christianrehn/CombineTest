import {
    DrillConfigurationWithFixedDistancesGenerator,
    DrillConfigurationWithRandomDistancesGenerator,
    DrillConfigurationWithRandomFromFixedDistancesGenerator,
    IDrillConfiguration
} from "./DrillConfiguration";
import {AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "../AverageStrokesData";

export const distanceGenerators: string[] = ["RandomDistancesGenerator", "FixedDistancesGenerator", "RandomFromFixedDistancesGenerator"];
export const createNewDrillConfigurationWithDistanceGenerator = (
    drillConfiguration: IDrillConfiguration,
    distanceGenerator: string,
    averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>
): IDrillConfiguration => {
    switch (distanceGenerator) {
        case "RandomDistancesGenerator":
            return new DrillConfigurationWithRandomDistancesGenerator(
                drillConfiguration.getUuid(),
                drillConfiguration.getName(),
                drillConfiguration.getDescription(),
                0,// drillConfiguration.distanceGenerator.minIncludedDistance,
                10,// drillConfiguration.distanceGenerator.maxExcludedDistance,
                drillConfiguration.getUnit(),
                3,// drillConfiguration.distanceGenerator.numberOfShots,
                drillConfiguration.startGroundType,
                drillConfiguration.endGroundTypes,
                averageStrokesDataMap);
        case "FixedDistancesGenerator":
            return new DrillConfigurationWithFixedDistancesGenerator(
                drillConfiguration.getUuid(),
                drillConfiguration.getName(),
                drillConfiguration.getDescription(),
                [1, 2],// drillConfiguration.distanceGenerator.distances,
                drillConfiguration.getUnit(),
                3,// drillConfiguration.distanceGenerator.numberOfRounds,
                drillConfiguration.startGroundType,
                drillConfiguration.endGroundTypes,
                averageStrokesDataMap);
        case "RandomFromFixedDistancesGenerator":
            return new DrillConfigurationWithRandomFromFixedDistancesGenerator(
                drillConfiguration.getUuid(),
                drillConfiguration.getName(),
                drillConfiguration.getDescription(),
                [1, 2],// drillConfiguration.distanceGenerator.distances,
                drillConfiguration.getUnit(),
                3,// drillConfiguration.distanceGenerator.numberOfRounds,
                drillConfiguration.startGroundType,
                drillConfiguration.endGroundTypes,
                averageStrokesDataMap);
    }
}
