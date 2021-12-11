import {
    DrillConfigurationWithFixedDistancesGenerator,
    DrillConfigurationWithRandomDistancesGenerator,
    DrillConfigurationWithRandomFromFixedDistancesGenerator,
    IDrillConfiguration
} from "./DrillConfiguration";
import {AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "../AverageStrokesData";
import {assert} from "chai";

export const drillConfigurationsToString = (
    drillConfigurations: IDrillConfiguration[],
): string => {
    assert(drillConfigurations !== undefined, "drillConfigurations === undefined");
    assert(drillConfigurations !== null, "drillConfigurations === null");

    return JSON.stringify([]);
}

export const drillConfigurationsFromJson = (
    drillConfigurationsAsJson: any[],
    averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>
): IDrillConfiguration[] => {
    assert(drillConfigurationsAsJson !== undefined, "drillConfigurationsAsJson === undefined");
    assert(drillConfigurationsAsJson !== null, "drillConfigurationsAsJson === null");

    return drillConfigurationsAsJson
        .map((drillConfigurationAsJson: any): IDrillConfiguration => {
            switch (drillConfigurationAsJson.distanceGenerator.type) {
                case "RandomDistancesGenerator":
                    return new DrillConfigurationWithRandomDistancesGenerator(
                        drillConfigurationAsJson.uuid,
                        drillConfigurationAsJson.name,
                        drillConfigurationAsJson.description,
                        drillConfigurationAsJson.distanceGenerator.minIncludedDistance,
                        drillConfigurationAsJson.distanceGenerator.maxExcludedDistance,
                        drillConfigurationAsJson.unit,
                        drillConfigurationAsJson.distanceGenerator.numberOfShots,
                        drillConfigurationAsJson.startGroundType,
                        drillConfigurationAsJson.endGroundTypes,
                        averageStrokesDataMap);
                case "FixedDistancesGenerator":
                    return new DrillConfigurationWithFixedDistancesGenerator(
                        drillConfigurationAsJson.uuid,
                        drillConfigurationAsJson.name,
                        drillConfigurationAsJson.description,
                        drillConfigurationAsJson.distanceGenerator.distances,
                        drillConfigurationAsJson.unit,
                        drillConfigurationAsJson.distanceGenerator.numberOfRounds,
                        drillConfigurationAsJson.startGroundType,
                        drillConfigurationAsJson.endGroundTypes,
                        averageStrokesDataMap);
                case "RandomFromFixedDistancesGenerator":
                    return new DrillConfigurationWithRandomFromFixedDistancesGenerator(
                        drillConfigurationAsJson.uuid,
                        drillConfigurationAsJson.name,
                        drillConfigurationAsJson.description,
                        drillConfigurationAsJson.distanceGenerator.distances,
                        drillConfigurationAsJson.unit,
                        drillConfigurationAsJson.distanceGenerator.numberOfRounds,
                        drillConfigurationAsJson.startGroundType,
                        drillConfigurationAsJson.endGroundTypes,
                        averageStrokesDataMap);
            }
        })
        .filter((drillConfiguration: IDrillConfiguration) => !!drillConfiguration);
}
