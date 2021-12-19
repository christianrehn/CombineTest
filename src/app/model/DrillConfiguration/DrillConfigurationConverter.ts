import {
    DrillConfigurationWithFixedDistancesGenerator,
    DrillConfigurationWithRandomDistancesGenerator,
    DrillConfigurationWithRandomFromFixedDistancesGenerator,
    IDrillConfiguration
} from "./DrillConfiguration";
import {IAverageStrokesData} from "../AverageStrokesData/AverageStrokesData";
import {assert} from "chai";
import {
    FIXED_DISTANCES_GENERATOR,
    RANDOM_DISTANCES_GENERATOR,
    RANDOM_FROM_FIXED_DISTANCES_GENERATOR
} from "./DistanceGenerator";
import {GroundTypeEnum} from "../AverageStrokesData/GroundTypeEnum";

export const drillConfigurationsToString = (
    drillConfigurations: IDrillConfiguration[],
): string => {
    assert(drillConfigurations !== undefined, "drillConfigurations === undefined");
    assert(drillConfigurations !== null, "drillConfigurations === null");
    const drillConfigurationsAsJson: any[] = drillConfigurations.map((drillConfiguration: IDrillConfiguration) => {
        return drillConfiguration.toJson();
    });
    return JSON.stringify(drillConfigurationsAsJson);
}

export const drillConfigurationsFromJson = (
    drillConfigurationsAsJson: any[],
    averageStrokesDataMap: Map<GroundTypeEnum, IAverageStrokesData>
): IDrillConfiguration[] => {
    assert(drillConfigurationsAsJson !== undefined, "drillConfigurationsAsJson === undefined");
    assert(drillConfigurationsAsJson !== null, "drillConfigurationsAsJson === null");

    return drillConfigurationsAsJson
        .map((drillConfigurationAsJson: any): IDrillConfiguration => {
            switch (drillConfigurationAsJson.distanceGenerator.type) {
                case RANDOM_DISTANCES_GENERATOR:
                    return new DrillConfigurationWithRandomDistancesGenerator(drillConfigurationAsJson.uuid, drillConfigurationAsJson.name, drillConfigurationAsJson.description, drillConfigurationAsJson.unit, drillConfigurationAsJson.startGroundType, drillConfigurationAsJson.endGroundTypes, drillConfigurationAsJson.distanceGenerator.minIncludedDistance, drillConfigurationAsJson.distanceGenerator.maxExcludedDistance, drillConfigurationAsJson.distanceGenerator.numberOfShots, averageStrokesDataMap);
                case FIXED_DISTANCES_GENERATOR:
                    return new DrillConfigurationWithFixedDistancesGenerator(drillConfigurationAsJson.uuid, drillConfigurationAsJson.name, drillConfigurationAsJson.description, drillConfigurationAsJson.unit, drillConfigurationAsJson.startGroundType, drillConfigurationAsJson.endGroundTypes, drillConfigurationAsJson.distanceGenerator.distances, drillConfigurationAsJson.distanceGenerator.numberOfRounds, averageStrokesDataMap);
                case RANDOM_FROM_FIXED_DISTANCES_GENERATOR:
                    return new DrillConfigurationWithRandomFromFixedDistancesGenerator(drillConfigurationAsJson.uuid, drillConfigurationAsJson.name, drillConfigurationAsJson.description, drillConfigurationAsJson.unit, drillConfigurationAsJson.startGroundType, drillConfigurationAsJson.endGroundTypes, drillConfigurationAsJson.distanceGenerator.distances, drillConfigurationAsJson.distanceGenerator.numberOfRounds, averageStrokesDataMap);
            }
        })
        .filter((drillConfiguration: IDrillConfiguration) => !!drillConfiguration);
}
