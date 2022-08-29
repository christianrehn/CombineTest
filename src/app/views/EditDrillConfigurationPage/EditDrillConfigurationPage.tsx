import React from 'react';
import './EditDrillConfigurationPage.scss';
import {
    IDrillConfiguration,
    IEndGroundConfig,
    IFixedDistancesGenerator,
    IRandomDistancesGenerator
} from "../../model/DrillConfiguration/DrillConfiguration";
import {
    DrillConfigurationTextInput
} from "../../components/DrillConfiguration/DrillConfigurationTextInput/DrillConfigurationTextInput";
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
import {NumberPlusMinusInput} from "../../components/DrillConfiguration/NumberPlusMinusInput/NumberPlusMinusInput";
import {EndGroundConfigsTable} from "../../components/DrillConfiguration/EndGroundConfigsTable/EndGroundConfigsTable";
import {startGroundTypes,} from "../../model/AverageStrokesData/GroundType";
import {drillTypes, shotsGainedDrillType, spinDrillType} from "../../model/SelectValues/DrillType";
import {lengthUnits} from "../../model/SelectValues/LengthUnit";

export const EditDrillConfigurationPageName: string = "EditDrillConfigurationPage";

interface IEditDrillConfigurationPageProps {
    selectedDrillConfiguration: IDrillConfiguration;
    handleBackClicked: () => void;
    handleSaveDrillConfigurations: (changedDrillConfiguration: IDrillConfiguration) => void;
    averageStrokesDataMap: Map<string, IAverageStrokesData>
}

const DEFAULT_DRILL_TYPE: string = shotsGainedDrillType;

const MIN_TARGET_RPM_PER_UNIT: number = 1;
const DEFAULT_TARGET_RPM_PER_UNIT: number = 200;

const MIN_DEVIATION_IN_UNIT: number = 0.1;
const DEFAULT_DEVIATION_IN_UNIT: number = 1.0;

const MIN_NAME: number = 1;
const MAX_NAME: number = 30;

const MIN_DISTANCE: number = 1;
const MAX_DISTANCE: number = 999;

const MIN_ROUNDS: number = 1;
const MAX_ROUNDS: number = 99;

const MIN_SHOTS: number = 1;

export const EditDrillConfigurationPage: React.FC<IEditDrillConfigurationPageProps> = (props: IEditDrillConfigurationPageProps): JSX.Element => {
    assert(!!props.selectedDrillConfiguration, "EditDrillConfigurationPage - !props.selectedDrillConfiguration");
    console.log("EditDrillConfigurationPage - props.selectedDrillConfiguration", props.selectedDrillConfiguration);

    const [name, setName] = React.useState<string>(props.selectedDrillConfiguration.getName());
    const [nameError, setNameError] = React.useState<boolean>(true);
    const [description, setDescription] = React.useState<string>(props.selectedDrillConfiguration.getDescription());
    const [drillType, setDrillType] = React.useState<string>(props.selectedDrillConfiguration.getDrillType() || DEFAULT_DRILL_TYPE);
    const [lengthUnit, setLengthUnit] = React.useState<string>(props.selectedDrillConfiguration.getUnit());
    const [targetRpmPerUnit, setTargetRpmPerUnit] = React.useState<number>(props.selectedDrillConfiguration.getTargetRpmPerUnit() || DEFAULT_TARGET_RPM_PER_UNIT);
    const [targetRpmPerUnitError, setTargetRpmPerUnitError] = React.useState<boolean>(true);
    const [deviationInUnit, setDeviationInUnit] = React.useState<number>(props.selectedDrillConfiguration.getDeviationInUnit() || DEFAULT_DEVIATION_IN_UNIT);
    const [deviationInUnitError, setDeviationInUnitError] = React.useState<boolean>(true);
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
        // validate targetRpmPerUnit
        setTargetRpmPerUnitError(drillType === shotsGainedDrillType && targetRpmPerUnit < MIN_TARGET_RPM_PER_UNIT);
    }, [targetRpmPerUnit])

    React.useEffect((): void => {
        // validate deviationInUnit
        setDeviationInUnitError(drillType === shotsGainedDrillType && deviationInUnit < MIN_DEVIATION_IN_UNIT);
    }, [deviationInUnit])

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
        return nameError || targetRpmPerUnitError || deviationInUnitError || (distanceGenerator === RANDOM_DISTANCES_GENERATOR
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
                                  props.handleSaveDrillConfigurations(undefined);

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
                    <div className={error() ? "disabled back-flex-item flex-item" : "back-flex-item flex-item"}>
                        <span className="back-span"
                              onClick={(): void => {
                                  // save changes
                                  const newDrillConfiguration: IDrillConfiguration =
                                      createNewDrillConfigurationWithDistanceGenerator(
                                          props.selectedDrillConfiguration.getUuid(),
                                          name,
                                          description,
                                          drillType,
                                          lengthUnit,
                                          targetRpmPerUnit,
                                          deviationInUnit,
                                          distanceGenerator,
                                          startGroundType,
                                          endGroundConfigs,
                                          minIncludedDistance,
                                          maxExcludedDistance,
                                          numberOfShots,
                                          distances.split(" ").map(Number).filter((n: number): boolean => n > 0),
                                          numberOfRounds,
                                          props.averageStrokesDataMap
                                      )
                                  ;
                                  props.handleSaveDrillConfigurations(newDrillConfiguration);

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
                    <DrillConfigurationTextInput
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
                    <DrillConfigurationTextInput
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
                    <DrillConfigurationTextInput
                        label={`Target RPM per ${lengthUnit}`}
                        hidden={drillType !== spinDrillType}
                        error={targetRpmPerUnitError}
                        type="number"
                        value={targetRpmPerUnit}
                        maxLength={4}
                        min={MIN_TARGET_RPM_PER_UNIT}
                        handleOnChange={(value: string): void => {
                            setTargetRpmPerUnit(Number(value));
                        }}
                    />
                </div>
                <div className="deviation-in-unit-input">
                    <DrillConfigurationTextInput
                        label={`Deviation in ${lengthUnit}`}
                        hidden={drillType !== spinDrillType}
                        error={deviationInUnitError}
                        type="number"
                        value={deviationInUnit}
                        maxLength={3}
                        min={MIN_DEVIATION_IN_UNIT}
                        handleOnChange={(value: string): void => {
                            setDeviationInUnit(Number(value));
                        }}
                    />
                </div>
                <div className="start-ground-type-select">
                    <DrillConfigurationSelect
                        label={"Start Ground Type"}
                        hidden={drillType === spinDrillType}
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
                        hidden={drillType === spinDrillType}
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
                            <DrillConfigurationTextInput
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
                            <DrillConfigurationTextInput
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
                                <DrillConfigurationTextInput
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
