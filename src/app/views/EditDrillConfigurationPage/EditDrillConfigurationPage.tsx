import React from 'react';
import './EditDrillConfigurationPage.scss';
import {
    IDrillConfiguration,
    IEndGroundConfig,
    IFixedDistancesGenerator,
    IRandomDistancesGenerator
} from "../../model/DrillConfiguration/DrillConfiguration";
import {TextInput} from "../../components/TextInput/TextInput";
import deleteIcon from "../../../assets/delete.png";
import backIcon from '../../../assets/back.png';
import {
    DrillConfigurationSelect
} from "../../components/DrillConfiguration/DrillConfigurationSelect/DrillConfigurationSelect";
import {assert} from "chai";
import {
    createNewDrillConfigurationWithDistanceGenerator,
    distanceGenerators,
    FIXED_DISTANCES_GENERATOR,
    RANDOM_DISTANCES_GENERATOR,
    RANDOM_FROM_FIXED_DISTANCES_GENERATOR
} from "../../model/DrillConfiguration/DistanceGenerator";
import {IAverageStrokesData} from "../../model/AverageStrokesData/AverageStrokesData";
import {NumberPlusMinusInput} from "../../components/NumberPlusMinusInput/NumberPlusMinusInput";
import {EndGroundConfigsTable} from "../../components/DrillConfiguration/EndGroundConfigsTable/EndGroundConfigsTable";
import {startGroundTypes,} from "../../model/AverageStrokesData/GroundType";
import {
    asFewStrokesAsPossibleDrillType,
    drillTypes,
    spinDrillType,
    targetCircleDrillType,
    trackmanScoreAndShotsGainedDrillType
} from "../../model/SelectValues/DrillType";
import {lengthUnits} from "../../model/SelectValues/LengthUnit";
import {
    outsideTargetCircleActions,
    retryOutsideTargetCircleAction
} from "../../model/SelectValues/OutsideTargetCircleAction";
import {PageNamesType} from "../PageNamesType";

export const EditDrillConfigurationPageName: PageNamesType = "EditDrillConfigurationPage";


const DEFAULT_DRILL_TYPE: string = trackmanScoreAndShotsGainedDrillType;

const DEFAULT_NUMBER_OF_DROP_SHOTS: number = 0;

const MIN_TARGET_RPM_PER_UNIT: number = 1;
const DEFAULT_TARGET_RPM_PER_UNIT: number = 250;

const MIN_DEVIATION_IN_UNIT: number = 1;
const DEFAULT_DEVIATION_IN_UNIT: number = 3;

const MIN_DEVIATION_IN_PERCENT: number = 1;
const DEFAULT_DEVIATION_IN_PERCENT: number = 30;

const DEFAULT_MAX_COASTING_IN_UNIT: number = 2;
const MIN_MAX_COASTING_IN_UNIT: number = 0;
const DEFAULT_MINUS_1_SCORE_PER_COASTING_IN_UNIT: number = 0.01;
const MIN_MINUS_1_SCORE_PER_COASTING_IN_UNIT: number = 0.01;

const MIN_TARGET_CIRCLE_RADIUS_SCORE_100_IN_UNIT: number = 0.1;
const DEFAULT_TARGET_CIRCLE_RADIUS_SCORE_100_IN_UNIT: number = 1.8;
const DEFAULT_TARGET_CIRCLE_RADIUS_SCORE_0_IN_UNIT: number = 10.0;

const MIN_TARGET_CIRCLE_RADIUS_SCORE_100_IN_PERCENT: number = 1;
const DEFAULT_TARGET_CIRCLE_RADIUS_SCORE_100_IN_PERCENT: number = 5;
const DEFAULT_TARGET_CIRCLE_RADIUS_SCORE_0_IN_PERCENT: number = 30;

const DEFAULT_OUTSIDE_TARGET_CIRCLE_ACTION: string = retryOutsideTargetCircleAction;

const MIN_NAME: number = 1;
const MAX_NAME: number = 30;

const MIN_DISTANCE: number = 1;
const MAX_DISTANCE: number = 999;

const MIN_ROUNDS: number = 1;
const MAX_ROUNDS: number = 99;

const MIN_SHOTS: number = 1;

interface IEditDrillConfigurationPageProps {
    selectedDrillConfiguration: IDrillConfiguration;
    handleBackClicked: () => void;
    handleSaveDrillConfiguration: (changedDrillConfiguration: IDrillConfiguration) => void;
    averageStrokesDataMap: Map<string, IAverageStrokesData>
}

export const EditDrillConfigurationPage: React.FC<IEditDrillConfigurationPageProps> = (props: IEditDrillConfigurationPageProps): JSX.Element => {
    assert(!!props.selectedDrillConfiguration, "EditDrillConfigurationPage - !props.selectedDrillConfiguration");
    assert(!!props.handleBackClicked, "EditDrillConfigurationPage - !props.handleBackClicked");
    assert(!!props.handleSaveDrillConfiguration, "EditDrillConfigurationPage - !props.handleSaveDrillConfiguration");
    assert(!!props.averageStrokesDataMap, "EditDrillConfigurationPage - !props.averageStrokesDataMap");
    console.log("EditDrillConfigurationPage - props.selectedDrillConfiguration", props.selectedDrillConfiguration);

    const [name, setName] = React.useState<string>(props.selectedDrillConfiguration.getName());
    const [nameError, setNameError] = React.useState<boolean>(true);
    const [description, setDescription] = React.useState<string>(props.selectedDrillConfiguration.getDescription());
    const [drillType, setDrillType] = React.useState<string>(props.selectedDrillConfiguration.getDrillType() || DEFAULT_DRILL_TYPE);
    const [numberOfDropShots, setNumberOfDropShots] = React.useState<number>(props.selectedDrillConfiguration.getNumberOfDropShots() || DEFAULT_NUMBER_OF_DROP_SHOTS);
    const [lengthUnit, setLengthUnit] = React.useState<string>(props.selectedDrillConfiguration.getUnit());
    const [targetSpinInRpmPerUnit, setTargetSpinInRpmPerUnit] = React.useState<number>(props.selectedDrillConfiguration.getTargetSpinInRpmPerUnit() || DEFAULT_TARGET_RPM_PER_UNIT);
    const [targetSpinInRpmPerUnitError, setTargetSpinInRpmPerUnitError] = React.useState<boolean>(true);
    const [maxDeviationAsUnitNotPercent, setMaxDeviationAsUnitNotPercent] = React.useState<boolean>(props.selectedDrillConfiguration.getMaxDeviationAsUnitNotPercent() ?? true);
    const [maxDeviationInUnit, setMaxDeviationInUnit] = React.useState<number>(props.selectedDrillConfiguration.getMaxDeviationInUnit() || DEFAULT_DEVIATION_IN_UNIT);
    const [maxDeviationInPercent, setMaxDeviationInPercent] = React.useState<number>(props.selectedDrillConfiguration.getMaxDeviationInPercent() || DEFAULT_DEVIATION_IN_PERCENT);
    const [considerCoastingBehavior, setConsiderCoastingBehavior] = React.useState<boolean>(props.selectedDrillConfiguration.getConsiderCoastingBehavior() ?? true);
    const [maxCoastingInUnit, setMaxCoastingInUnit] = React.useState<number>(props.selectedDrillConfiguration.getMaxCoastingInUnit() ?? DEFAULT_MAX_COASTING_IN_UNIT);
    const [minus1ScorePerCoastingInUnit, setMinus1ScorePerCoastingInUnit] = React.useState<number>(props.selectedDrillConfiguration.getMinus1ScorePerCoastingInUnit() ?? DEFAULT_MINUS_1_SCORE_PER_COASTING_IN_UNIT);
    const [targetCircleRadiusAsUnitNotPercent, setTargetCircleRadiusAsUnitNotPercent] = React.useState<boolean>(props.selectedDrillConfiguration.getTargetCircleRadiusAsUnitNotPercent() ?? true);
    const [targetCircleRadiusScore100InUnit, setTargetCircleRadiusScore100InUnit] = React.useState<number>(props.selectedDrillConfiguration.getTargetCircleRadiusScore100InUnit() || DEFAULT_TARGET_CIRCLE_RADIUS_SCORE_100_IN_UNIT);
    const [targetCircleRadiusScore0InUnit, setTargetCircleRadiusScore0InUnit] = React.useState<number>(props.selectedDrillConfiguration.getTargetCircleRadiusScore0InUnit() || DEFAULT_TARGET_CIRCLE_RADIUS_SCORE_0_IN_UNIT);
    const [targetCircleRadiusScore100InPercent, setTargetCircleRadiusScore100InPercent] = React.useState<number>(props.selectedDrillConfiguration.getTargetCircleRadiusScore100InPercent() || DEFAULT_TARGET_CIRCLE_RADIUS_SCORE_100_IN_PERCENT);
    const [targetCircleRadiusScore0InPercent, setTargetCircleRadiusScore0InPercent] = React.useState<number>(props.selectedDrillConfiguration.getTargetCircleRadiusScore0InPercent() || DEFAULT_TARGET_CIRCLE_RADIUS_SCORE_0_IN_PERCENT);
    const [outsideTargetCircleAction, setOutsideTargetCircleAction] = React.useState<string>(props.selectedDrillConfiguration.getOutsideTargetCircleAction() || DEFAULT_OUTSIDE_TARGET_CIRCLE_ACTION);
    const [startGroundType, setStartGroundType] = React.useState<string>(props.selectedDrillConfiguration.getStartGroundType());
    const [endGroundConfigs, setEndGroundConfigs] = React.useState<IEndGroundConfig[]>(props.selectedDrillConfiguration.getEndGroundConfigs());
    const [distanceGenerator, setDistanceGenerator] = React.useState<string>(props.selectedDrillConfiguration.getDistanceGenerator());

    const [minIncludedDistance, setMinIncludedDistance] = React.useState<number>(((props.selectedDrillConfiguration as any) as IRandomDistancesGenerator).getMinIncludedDistance?.() || MIN_DISTANCE);
    const [minIncludedDistanceError, setMinIncludedDistanceError] = React.useState<boolean>(true);
    const [maxExcludedDistance, setMaxExcludedDistance] = React.useState<number>(((props.selectedDrillConfiguration as any) as IRandomDistancesGenerator).getMaxExcludedDistance?.() || MAX_DISTANCE);
    const [maxExcludedDistanceError, setMaxExcludedDistanceError] = React.useState<boolean>(true);
    const [numberOfShots, setNumberOfShots] = React.useState<number>(props.selectedDrillConfiguration.getNumberOfShots() || MIN_SHOTS);

    const [distances, setDistances] = React.useState<string>(((props.selectedDrillConfiguration as any) as IFixedDistancesGenerator).getDistances?.().join(" ") || "");
    const [distancesError, setDistancesError] = React.useState<boolean>(true);
    const [numberOfRounds, setNumberOfRounds] = React.useState<number>(((props.selectedDrillConfiguration as any) as IFixedDistancesGenerator).getNumberOfRounds?.() || MIN_ROUNDS);

    React.useEffect((): void => {
        // validate name
        setNameError(name.length < MIN_NAME || name.length > MAX_NAME);
    }, [name])

    React.useEffect((): void => {
        // validate targetSpinInRpmPerUnit
        setTargetSpinInRpmPerUnitError(drillType === trackmanScoreAndShotsGainedDrillType && targetSpinInRpmPerUnit < MIN_TARGET_RPM_PER_UNIT);
    }, [targetSpinInRpmPerUnit])

    React.useEffect((): void => {
        // validate distances
        setDistancesError(distances.length <= 0);
    }, [distances])

    React.useEffect((): void => {
        // validate minIncludedDistance
        setMinIncludedDistanceError(minIncludedDistance < MIN_DISTANCE || minIncludedDistance > MAX_DISTANCE);
    }, [minIncludedDistance])

    React.useEffect((): void => {
        // validate maxExcludedDistance
        setMaxExcludedDistanceError(maxExcludedDistance < MIN_DISTANCE || maxExcludedDistance > MAX_DISTANCE);
    }, [maxExcludedDistanceError])

    const error = (): boolean => {
        return nameError || targetSpinInRpmPerUnitError || (distanceGenerator === RANDOM_DISTANCES_GENERATOR
            ? minIncludedDistanceError || maxExcludedDistanceError
            : [FIXED_DISTANCES_GENERATOR, RANDOM_FROM_FIXED_DISTANCES_GENERATOR].includes(distanceGenerator)
                ? distancesError
                : false);
    }

    return (
        <div className="edit-drill-configuration-page page">
            <div className="edit-drill-configuration-top">
                <div className="edit-drill-configuration-flex-item flex-item">
                    <div className="page-header">
                        <h3>Edit Drill Configuration</h3>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
                    <div className="delete-flex-item flex-item">
                        <span className="delete-span"
                              onClick={(): void => {
                                  // save changes
                                  props.handleSaveDrillConfiguration(undefined);

                                  // back to drill selection page
                                  props.handleBackClicked()
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={deleteIcon}
                                     alt="Delete Configuration"
                                />
                            </div>
                        </span>
                    </div>
                    <div className={`back-flex-item flex-item ${error() ? "disabled " : ""}`}>
                        <span className="back-span"
                              onClick={(): void => {
                                  // save changes
                                  const newDrillConfiguration: IDrillConfiguration =
                                      createNewDrillConfigurationWithDistanceGenerator(
                                          distanceGenerator,
                                          props.selectedDrillConfiguration.getUuid(),
                                          name,
                                          description,
                                          drillType,
                                          numberOfDropShots,
                                          lengthUnit,
                                          targetSpinInRpmPerUnit,
                                          maxDeviationAsUnitNotPercent,
                                          maxDeviationInUnit,
                                          maxDeviationInPercent,
                                          considerCoastingBehavior,
                                          maxCoastingInUnit,
                                          minus1ScorePerCoastingInUnit,
                                          targetCircleRadiusAsUnitNotPercent,
                                          targetCircleRadiusScore100InUnit,
                                          targetCircleRadiusScore0InUnit,
                                          targetCircleRadiusScore100InPercent,
                                          targetCircleRadiusScore0InPercent,
                                          outsideTargetCircleAction,
                                          startGroundType,
                                          endGroundConfigs,
                                          minIncludedDistance,
                                          maxExcludedDistance,
                                          numberOfShots,
                                          distances.split(" ").map(Number).filter((n: number): boolean => n > 0),
                                          numberOfRounds,
                                          props.averageStrokesDataMap
                                      );
                                  props.handleSaveDrillConfiguration(newDrillConfiguration);

                                  // back to drill selection page
                                  props.handleBackClicked()
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={backIcon}
                                     alt="Back"
                                />
                            </div>
                        </span>
                    </div>
                </div>
            </div>

            <div className="edit-drill-configuration-input">
                <div className="name-input">
                    <TextInput
                        label={"Name"}
                        error={nameError}
                        type={"text"}
                        value={name}
                        minLength={MIN_NAME}
                        maxLength={MAX_NAME}
                        handleOnChange={(value: string): void => {
                            setName(value);
                        }}
                    />
                </div>
                <div className="description-input">
                    <TextInput
                        label={"Description"}
                        type={"text"}
                        value={description}
                        maxLength={110}
                        handleOnChange={(value: string): void => {
                            setDescription(value);
                        }}
                    />
                </div>
                <div className="drillType-select">
                    <DrillConfigurationSelect
                        label={"Drill Type"}
                        index={drillTypes.indexOf(drillType)}
                        stringValues={drillTypes}
                        handleOnChange={(index: number): void => {
                            assert(index >= 0, "index < 0");
                            setDrillType(drillTypes[index]);
                        }}
                    />
                </div>
                <div className="number-of-drop-shots-input">
                    <NumberPlusMinusInput
                        label={`Number of worst shots to drop from average calculation`}
                        hidden={[asFewStrokesAsPossibleDrillType].includes(drillType)}
                        value={numberOfDropShots}
                        min={0}
                        handleOnClick={(value: number): void => {
                            setNumberOfDropShots(value);
                        }}
                    />
                </div>
                <div className="unit-select">
                    <DrillConfigurationSelect
                        label={"Unit"}
                        index={lengthUnits.indexOf(lengthUnit)}
                        stringValues={lengthUnits}
                        handleOnChange={(index: number): void => {
                            assert(index >= 0, "index < 0");
                            setLengthUnit(lengthUnits[index]);
                        }}
                    />
                </div>
                <div className="target-rpm-per-unit-input">
                    <TextInput
                        label={`Target Spin in RPM per ${lengthUnit}`}
                        hidden={![spinDrillType].includes(drillType)}
                        error={targetSpinInRpmPerUnitError}
                        type="number"
                        value={targetSpinInRpmPerUnit}
                        maxLength={4}
                        min={MIN_TARGET_RPM_PER_UNIT}
                        handleOnChange={(value: string): void => {
                            setTargetSpinInRpmPerUnit(Number(value));
                        }}
                    />
                </div>
                <div className="max-deviation-as-unit-not-percent-input">
                    <TextInput
                        label={`Max. Carry Deviation as ${lengthUnit} or %`}
                        hidden={![spinDrillType].includes(drillType)}
                        type="checkbox"
                        checked={maxDeviationAsUnitNotPercent}
                        handleOnChange={(): void => {
                            setMaxDeviationAsUnitNotPercent(!maxDeviationAsUnitNotPercent);
                        }}
                    />
                </div>
                <div className="max-deviation-in-unit-input">
                    <NumberPlusMinusInput
                        label={`Max. Carry Deviation in ${lengthUnit}`}
                        hidden={![spinDrillType].includes(drillType) || !maxDeviationAsUnitNotPercent}
                        value={maxDeviationInUnit}
                        min={MIN_DEVIATION_IN_UNIT}
                        handleOnClick={(value: number): void => {
                            setMaxDeviationInUnit(value);
                        }}
                    />
                </div>
                <div className="max-deviation-in-percent-input">
                    <NumberPlusMinusInput
                        label={`Max. Carry Deviation in %`}
                        hidden={![spinDrillType].includes(drillType) || maxDeviationAsUnitNotPercent}
                        value={maxDeviationInPercent}
                        min={MIN_DEVIATION_IN_PERCENT}
                        handleOnClick={(value: number): void => {
                            setMaxDeviationInPercent(value);
                        }}
                    />
                </div>
                <div className="consider-coasting-behavior-input">
                    <TextInput
                        label={`Consider coasting behavior (total distance)`}
                        hidden={![spinDrillType].includes(drillType)}
                        type="checkbox"
                        checked={considerCoastingBehavior}
                        handleOnChange={(): void => {
                            setConsiderCoastingBehavior(!considerCoastingBehavior);
                        }}
                    />
                </div>
                <div className="max-coasting-in-unit-input">
                    <NumberPlusMinusInput
                        label={`Maximum coasting without score deduction in ${lengthUnit}`}
                        hidden={![spinDrillType].includes(drillType) || !considerCoastingBehavior}
                        delta={0.1}
                        decimalPlaces={1}
                        value={maxCoastingInUnit}
                        min={MIN_MAX_COASTING_IN_UNIT}
                        handleOnClick={(value: number): void => {
                            setMaxCoastingInUnit(value);
                        }}
                    />
                </div>
                <div className="minus-1-score-per-coasting-in-unit-input">
                    <NumberPlusMinusInput
                        label={`Reduce score by -1 per additional coasting in ${lengthUnit}`}
                        hidden={![spinDrillType].includes(drillType) || !considerCoastingBehavior}
                        delta={0.01}
                        decimalPlaces={2}
                        value={minus1ScorePerCoastingInUnit}
                        min={MIN_MINUS_1_SCORE_PER_COASTING_IN_UNIT}
                        handleOnClick={(value: number): void => {
                            setMinus1ScorePerCoastingInUnit(value);
                        }}
                    />
                </div>
                <div className="target-circle-radius-as-unit-not-percent-input">
                    <TextInput
                        label={`Target Circle Radius as ${lengthUnit} or %`}
                        hidden={![targetCircleDrillType, asFewStrokesAsPossibleDrillType].includes(drillType)}
                        type="checkbox"
                        checked={targetCircleRadiusAsUnitNotPercent}
                        handleOnChange={(): void => {
                            setTargetCircleRadiusAsUnitNotPercent(!targetCircleRadiusAsUnitNotPercent);
                        }}
                    />
                </div>
                <div className="target-circle-radius-in-unit-score-100-input">
                    <NumberPlusMinusInput
                        label={

                            `Target Circle Radius ${targetCircleDrillType === drillType ? "for a score of 100 " : ""}in ${lengthUnit}`}
                        hidden={![targetCircleDrillType, asFewStrokesAsPossibleDrillType].includes(drillType) || !targetCircleRadiusAsUnitNotPercent}
                        delta={0.1}
                        decimalPlaces={1}
                        value={targetCircleRadiusScore100InUnit}
                        min={MIN_TARGET_CIRCLE_RADIUS_SCORE_100_IN_UNIT}
                        handleOnClick={(value: number): void => {
                            setTargetCircleRadiusScore100InUnit(value);
                        }}
                    />
                </div>
                <div className="target-circle-radius-in-unit-score-0-input">
                    <NumberPlusMinusInput
                        label={`Target Circle Radius for a score of 0 in ${lengthUnit}`}
                        hidden={![targetCircleDrillType].includes(drillType) || !targetCircleRadiusAsUnitNotPercent}
                        value={targetCircleRadiusScore0InUnit}
                        min={targetCircleRadiusScore100InUnit}
                        handleOnClick={(value: number): void => {
                            setTargetCircleRadiusScore0InUnit(value);
                        }}
                    />
                </div>
                <div className="target-circle-radius-in-percent-score-100-input">
                    <NumberPlusMinusInput
                        label={`Target Circle Radius ${targetCircleDrillType === drillType ? "for a score of 100 " : ""}in %`}
                        hidden={![targetCircleDrillType, asFewStrokesAsPossibleDrillType].includes(drillType) || targetCircleRadiusAsUnitNotPercent}
                        value={targetCircleRadiusScore100InPercent}
                        min={MIN_TARGET_CIRCLE_RADIUS_SCORE_100_IN_PERCENT}
                        handleOnClick={(value: number): void => {
                            setTargetCircleRadiusScore100InPercent(value);
                        }}
                    />
                </div>
                <div className="target-circle-radius-in-percent-score-0-input">
                    <NumberPlusMinusInput
                        label={`Target Circle Radius for a score of 0 in %`}
                        hidden={![targetCircleDrillType].includes(drillType) || targetCircleRadiusAsUnitNotPercent}
                        value={targetCircleRadiusScore0InPercent}
                        min={targetCircleRadiusScore100InPercent}
                        handleOnClick={(value: number): void => {
                            setTargetCircleRadiusScore0InPercent(value);
                        }}
                    />
                </div>
                <div className="outside-target-circle-action-select">
                    <DrillConfigurationSelect
                        label={"If shot is outside of target circle"}
                        hidden={![asFewStrokesAsPossibleDrillType].includes(drillType)}
                        index={outsideTargetCircleActions.indexOf(outsideTargetCircleAction)}
                        stringValues={outsideTargetCircleActions}
                        handleOnChange={(index: number): void => {
                            assert(index >= 0, "index < 0");
                            setOutsideTargetCircleAction(outsideTargetCircleActions[index]);
                        }}
                    />
                </div>
                <div className="start-ground-type-select">
                    <DrillConfigurationSelect
                        label={"Start Ground Type"}
                        hidden={[spinDrillType, targetCircleDrillType, asFewStrokesAsPossibleDrillType].includes(drillType)}
                        index={startGroundTypes.indexOf(startGroundType)}
                        stringValues={startGroundTypes}
                        handleOnChange={(index: number): void => {
                            if (index >= 0) {
                                const startGroundType: string = startGroundTypes[index];
                                setStartGroundType(startGroundType);
                            }
                        }}
                    />
                </div>
                <div className="end-ground-types-table">
                    <EndGroundConfigsTable
                        label="End Ground Types"
                        hidden={[spinDrillType, targetCircleDrillType, asFewStrokesAsPossibleDrillType].includes(drillType)}
                        endGroundConfigs={endGroundConfigs}
                        handleEndGroundConfigChanged={(endGroundConfig: IEndGroundConfig, endGroundConfigsIndex: number, newNotCHanged: boolean): void => {
                            assert(endGroundConfigsIndex >= 0, `endGroundConfigsIndex < 0: ${endGroundConfigsIndex}`);

                            const endGroundConfigsClone: IEndGroundConfig[] = [...endGroundConfigs];
                            if (newNotCHanged) {
                                // new row added
                                assert(!!endGroundConfig, "!endGroundConfig");
                                endGroundConfigsClone.splice(endGroundConfigsIndex, 0, endGroundConfig);
                            } else {
                                // row changed or deleted
                                assert(endGroundConfigsIndex < endGroundConfigsClone.length, "endGroundConfigsIndex >= endGroundConfigsClone.length");
                                if (!!endGroundConfig) {
                                    endGroundConfigsClone[endGroundConfigsIndex] = endGroundConfig; // changed
                                } else {
                                    endGroundConfigsClone.splice(endGroundConfigsIndex, 1); // deleted
                                }
                            }
                            setEndGroundConfigs(endGroundConfigsClone)
                        }}
                    />
                </div>
                <div className="distance-generator-select">
                    <DrillConfigurationSelect
                        label={"Distance Generator"}
                        index={distanceGenerators.indexOf(distanceGenerator)}
                        stringValues={distanceGenerators}
                        handleOnChange={(index: number): void => {
                            assert(index >= 0, "index < 0");
                            setDistanceGenerator(distanceGenerators[index])
                        }}
                    />
                </div>
                {distanceGenerator === RANDOM_DISTANCES_GENERATOR
                    ? <>
                        <div className="min-included-distance-input">
                            <TextInput
                                label={"Minimum Included Distance"}
                                error={minIncludedDistanceError}
                                type="number"
                                value={minIncludedDistance}
                                maxLength={3}
                                min={MIN_DISTANCE}
                                max={MAX_DISTANCE}
                                handleOnChange={(value: string): void => {
                                    setMinIncludedDistance(Number(value));
                                }}
                            />
                        </div>
                        <div className="max-excluded-distance-input">
                            <TextInput
                                label={"Maximum Excluded Distance"}
                                error={maxExcludedDistanceError}
                                type="number"
                                value={maxExcludedDistance}
                                maxLength={3}
                                min={MIN_DISTANCE}
                                max={MAX_DISTANCE}
                                handleOnChange={(value: string): void => {
                                    setMaxExcludedDistance(Number(value));
                                }}
                            />
                        </div>
                        <div className="NumberOfShotsInput">
                            <NumberPlusMinusInput
                                label="Number of Shots"
                                min={MIN_SHOTS}
                                value={numberOfShots}
                                handleOnClick={(numberOfShots: number): void => {
                                    setNumberOfShots(numberOfShots);
                                }}
                            />
                        </div>
                    </>
                    : [FIXED_DISTANCES_GENERATOR, RANDOM_FROM_FIXED_DISTANCES_GENERATOR].includes(distanceGenerator)
                        ? <>
                            <div className="distances-input">
                                <TextInput
                                    label={"Distances"}
                                    error={distancesError}
                                    type={"text"}
                                    value={distances}
                                    maxLength={110}
                                    handleOnChange={(value: string): void => {
                                        setDistances(value);
                                    }}
                                />
                            </div>
                            <div className="NumberOfRoundsInput">
                                <NumberPlusMinusInput
                                    label="Number of Rounds"
                                    min={MIN_ROUNDS}
                                    max={MAX_ROUNDS}
                                    value={numberOfRounds}
                                    handleOnClick={(value: number): void => {
                                        setNumberOfRounds(value);
                                    }}
                                />
                            </div>
                        </>
                        : null
                }
            </div>
        </div>
    );
}
