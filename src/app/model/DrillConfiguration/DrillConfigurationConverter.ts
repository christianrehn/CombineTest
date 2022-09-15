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
    averageStrokesDataMap: Map<string, IAverageStrokesData>
): IDrillConfiguration[] => {
    assert(drillConfigurationsAsJson !== undefined, "drillConfigurationsAsJson === undefined");
    assert(drillConfigurationsAsJson !== null, "drillConfigurationsAsJson === null");

    return drillConfigurationsAsJson
        .map((drillConfigurationAsJson: any): IDrillConfiguration => {
            console.log("drillConfigurationAsJson.targetCircleRadiusAsUnitNotPercent,", drillConfigurationAsJson.targetCircleRadiusAsUnitNotPercent,)
            switch (drillConfigurationAsJson.distanceGenerator.type) {
                case RANDOM_DISTANCES_GENERATOR:
                    return new DrillConfigurationWithRandomDistancesGenerator(
                        drillConfigurationAsJson.uuid,
                        drillConfigurationAsJson.name,
                        drillConfigurationAsJson.description,
                        drillConfigurationAsJson.drillType,
                        drillConfigurationAsJson.unit,
                        drillConfigurationAsJson.targetSpinInRpmPerUnit,
                        drillConfigurationAsJson.maxDeviationAsUnitNotPercent,
                        drillConfigurationAsJson.maxDeviationInUnit,
                        drillConfigurationAsJson.maxDeviationInPercent,
                        drillConfigurationAsJson.targetCircleRadiusAsUnitNotPercent,
                        drillConfigurationAsJson.targetCircleRadiusScore100InUnit,
                        drillConfigurationAsJson.targetCircleRadiusScore0InUnit,
                        drillConfigurationAsJson.targetCircleRadiusScore100InPercent,
                        drillConfigurationAsJson.targetCircleRadiusScore0InPercent,
                        drillConfigurationAsJson.startGroundType,
                        drillConfigurationAsJson.endGroundConfigs,
                        drillConfigurationAsJson.distanceGenerator.minIncludedDistance,
                        drillConfigurationAsJson.distanceGenerator.maxExcludedDistance,
                        drillConfigurationAsJson.distanceGenerator.numberOfShots,
                        averageStrokesDataMap);
                case FIXED_DISTANCES_GENERATOR:
                    return new DrillConfigurationWithFixedDistancesGenerator(
                        drillConfigurationAsJson.uuid,
                        drillConfigurationAsJson.name,
                        drillConfigurationAsJson.description,
                        drillConfigurationAsJson.drillType,
                        drillConfigurationAsJson.unit,
                        drillConfigurationAsJson.targetSpinInRpmPerUnit,
                        drillConfigurationAsJson.maxDeviationAsUnitNotPercent,
                        drillConfigurationAsJson.maxDeviationInUnit,
                        drillConfigurationAsJson.maxDeviationInPercent,
                        drillConfigurationAsJson.targetCircleRadiusAsUnitNotPercent,
                        drillConfigurationAsJson.targetCircleRadiusScore100InUnit,
                        drillConfigurationAsJson.targetCircleRadiusScore0InUnit,
                        drillConfigurationAsJson.targetCircleRadiusScore100InPercent,
                        drillConfigurationAsJson.targetCircleRadiusScore0InPercent,
                        drillConfigurationAsJson.startGroundType,
                        drillConfigurationAsJson.endGroundConfigs,
                        drillConfigurationAsJson.distanceGenerator.distances,
                        drillConfigurationAsJson.distanceGenerator.numberOfRounds,
                        averageStrokesDataMap);
                case RANDOM_FROM_FIXED_DISTANCES_GENERATOR:
                    return new DrillConfigurationWithRandomFromFixedDistancesGenerator(
                        drillConfigurationAsJson.uuid,
                        drillConfigurationAsJson.name,
                        drillConfigurationAsJson.description,
                        drillConfigurationAsJson.drillType,
                        drillConfigurationAsJson.unit,
                        drillConfigurationAsJson.targetSpinInRpmPerUnit,
                        drillConfigurationAsJson.maxDeviationAsUnitNotPercent,
                        drillConfigurationAsJson.maxDeviationInUnit,
                        drillConfigurationAsJson.maxDeviationInPercent,
                        drillConfigurationAsJson.targetCircleRadiusAsUnitNotPercent,
                        drillConfigurationAsJson.targetCircleRadiusScore100InUnit,
                        drillConfigurationAsJson.targetCircleRadiusScore0InUnit,
                        drillConfigurationAsJson.targetCircleRadiusScore100InPercent,
                        drillConfigurationAsJson.targetCircleRadiusScore0InPercent,
                        drillConfigurationAsJson.startGroundType,
                        drillConfigurationAsJson.endGroundConfigs,
                        drillConfigurationAsJson.distanceGenerator.distances,
                        drillConfigurationAsJson.distanceGenerator.numberOfRounds,
                        averageStrokesDataMap);
            }
        })
        .filter((drillConfiguration: IDrillConfiguration) => !!drillConfiguration);
}
