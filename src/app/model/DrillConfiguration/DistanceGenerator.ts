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
    drillType: string,
    numberOfDropShots: number,
    unit: string,
    targetSpinInRpmPerUnit: number,
    maxDeviationAsUnitNotPercent: boolean,
    maxDeviationInUnit: number,
    maxDeviationInPercent: number,
    considerCoastingBehavior: boolean,
    targetCircleRadiusAsUnitNotPercent: boolean,
    targetCircleRadiusScore100InUnit: number,
    targetCircleRadiusScore0InUnit: number,
    targetCircleRadiusScore100InPercent: number,
    targetCircleRadiusScore0InPercent: number,
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
            return new DrillConfigurationWithRandomDistancesGenerator(
                uuid,
                name,
                description,
                drillType,
                numberOfDropShots,
                unit,
                targetSpinInRpmPerUnit,
                maxDeviationAsUnitNotPercent,
                maxDeviationInUnit,
                maxDeviationInPercent,
                considerCoastingBehavior,
                targetCircleRadiusAsUnitNotPercent,
                targetCircleRadiusScore100InUnit,
                targetCircleRadiusScore0InUnit,
                targetCircleRadiusScore100InPercent,
                targetCircleRadiusScore0InPercent,
                startGroundType,
                endGroundConfigs,
                minIncludedDistance,
                maxExcludedDistance,
                numberOfShots,
                averageStrokesDataMap);
        case FIXED_DISTANCES_GENERATOR:
            return new DrillConfigurationWithFixedDistancesGenerator(
                uuid,
                name,
                description,
                drillType,
                numberOfDropShots,
                unit,
                targetSpinInRpmPerUnit,
                maxDeviationAsUnitNotPercent,
                maxDeviationInUnit,
                maxDeviationInPercent,
                considerCoastingBehavior,
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
        case RANDOM_FROM_FIXED_DISTANCES_GENERATOR:
            return new DrillConfigurationWithRandomFromFixedDistancesGenerator(
                uuid,
                name,
                description,
                drillType,
                numberOfDropShots,
                unit,
                targetSpinInRpmPerUnit,
                maxDeviationAsUnitNotPercent,
                maxDeviationInUnit,
                maxDeviationInPercent,
                considerCoastingBehavior,
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
    }
}
