import React from 'react';
import './EditDrillConfigurationPage.scss';
import {IDrillConfiguration, IEndGroundType} from "../../model/DrillConfiguration/DrillConfiguration";
import {
    DrillConfigurationTextInput
} from "../../components/DrillConfiguration/DrillConfigurationTextInput/DrillConfigurationTextInput";
import deleteIcon from "../../../assets/delete.png";
import backIcon from '../../../assets/back.png';
import {SelectDrillPageName} from "../SelectDrillPage/SelectDrillPage";
import {
    DrillConfigurationSelect
} from "../../components/DrillConfiguration/DrillConfigurationSelect/DrillConfigurationSelect";
import {lengthUnits} from "../../model/Unit/Unit";
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
import {EndGroundTypeTable} from "../../components/DrillConfiguration/EndGroundTypeTable/EndGroundTypeTable";
import {
    GroundTypeEnum,
    startGroundTypeEnums,
    StartGroundTypeEnumsType
} from "../../model/AverageStrokesData/GroundTypeEnum";

export const EditDrillConfigurationPageName: string = "EditDrillConfigurationPage";

interface IEditDrillConfigurationPageProps {
    drillConfigurations: IDrillConfiguration[];
    handleDrillConfigurationsChanged: (drillConfigurations: IDrillConfiguration[]) => void;
    selectedDrillConfiguration: IDrillConfiguration;
    handleSelectPageClicked: (page: string) => void;
    handleSaveDrillConfigurations: (changedDrillConfiguration: IDrillConfiguration) => void;
    averageStrokesDataMap: Map<GroundTypeEnum, IAverageStrokesData>
}

export const EditDrillConfigurationPage: React.FC<IEditDrillConfigurationPageProps> = (props: IEditDrillConfigurationPageProps): JSX.Element => {
    assert(!!props.selectedDrillConfiguration, "!props.selectedDrillConfiguration");
    console.log("EditDrillConfigurationPage - props.selectedDrillConfiguration", props.selectedDrillConfiguration);

    const [name, setName] = React.useState<string>(props.selectedDrillConfiguration.getName());
    const [description, setDescription] = React.useState<string>(props.selectedDrillConfiguration.getDescription());
    const [unit, setUnit] = React.useState<string>(props.selectedDrillConfiguration.getUnit());
    const [startGroundType, setStartGroundType] = React.useState<StartGroundTypeEnumsType>(props.selectedDrillConfiguration.getStartGroundType());
    const [endGroundTypes, setEndGroundTypes] = React.useState<IEndGroundType[]>(props.selectedDrillConfiguration.getEndGroundTypes());
    const [distanceGeneratorIndex, setDistanceGeneratorIndex] = React.useState<number>(0);

    const [minIncludedDistance, setMinIncludedDistance] = React.useState<number>(0);
    const [maxExcludedDistance, setMaxExcludedDistance] = React.useState<number>(0);
    const [distances, setDistances] = React.useState<number[]>([0, 3, 6]);
    const [numberOfRounds, setNumberOfRounds] = React.useState<number>(0);

    return (
        <div className="edit-drill-configuration-page page">
            <div className="edit-drill-configuration-flex-item flex-item">
                <div className="page-header">
                    <h3>Edit Drill Configuration</h3>
                </div>
                <div className="NameInput">
                    <DrillConfigurationTextInput
                        label={"Name"}
                        type={"text"}
                        value={name}
                        maxLength={10}
                        handleOnChange={(value: string): void => {
                            setName(value);
                        }}
                    />
                </div>
                <div className="DescriptionInput">
                    <DrillConfigurationTextInput
                        label={"Description"}
                        type={"text"}
                        value={description}
                        maxLength={80}
                        handleOnChange={(value: string): void => {
                            setDescription(value);
                        }}
                    />
                </div>
                <div className="UnitSelect">
                    <DrillConfigurationSelect
                        label={"Unit"}
                        index={lengthUnits.indexOf(unit)}
                        stringValues={lengthUnits}
                        handleOnChange={(index: number): void => {
                            if (index >= 0) {
                                setUnit(lengthUnits[index]);
                            }
                        }}
                    />
                </div>
                <div className="StartGroundTypeSelect">
                    <DrillConfigurationSelect
                        label={"Start Ground Type"}
                        index={startGroundTypeEnums.indexOf(startGroundType)}
                        startGroundTypeEnums={startGroundTypeEnums}
                        handleOnChange={(startGroundTypeEnumNumberKey: number): void => {
                            if (startGroundTypeEnumNumberKey >= 0) {
                                const startGroundTypeEnum: any = GroundTypeEnum[startGroundTypeEnumNumberKey]; // convert key to enum
                                setStartGroundType(startGroundTypeEnum);
                            }
                        }}
                    />
                </div>
                <div className="EndGroundTypeTable">
                    <EndGroundTypeTable
                        label="End Ground Types"
                        endGroundTypes={endGroundTypes}
                        handleEndGroundTypeChanged={(endGroundType: IEndGroundType, endGroundTypesIndex: number, newNotCHanged: boolean): void => {
                            assert(endGroundTypesIndex >= 0, `endGroundTypesIndex < 0: ${endGroundTypesIndex}`);

                            const endGroundTypesClone: IEndGroundType[] = [...endGroundTypes];
                            if (newNotCHanged) {
                                assert(!!endGroundType, "!endGroundType");
                                endGroundTypesClone.splice(endGroundTypesIndex, 0, endGroundType); // new
                            } else {
                                assert(endGroundTypesIndex < endGroundTypesClone.length, "endGroundTypesIndex >= endGroundTypesClone.length");
                                if (!!endGroundType) {
                                    endGroundTypesClone[endGroundTypesIndex] = endGroundType; // changed
                                } else {
                                    endGroundTypesClone.splice(endGroundTypesIndex, 1); // deleted
                                }
                            }
                            setEndGroundTypes(endGroundTypesClone)
                        }}
                    />
                </div>
                <div className="DistanceGeneratorSelect">
                    <DrillConfigurationSelect
                        label={"Distance Generator"}
                        index={distanceGeneratorIndex}
                        stringValues={distanceGenerators}
                        handleOnChange={(index: number): void => {
                            assert(index >= 0, "index < 0");
                            setDistanceGeneratorIndex(index)
                        }}
                    />
                </div>
                {distanceGenerators[distanceGeneratorIndex] === RANDOM_DISTANCES_GENERATOR
                    ? <>
                        <div className="MinIncludedDistanceInput">
                            <DrillConfigurationTextInput
                                label={"Minimum Included Distance"}
                                type="number"
                                value={minIncludedDistance}
                                maxLength={3}
                                handleOnChange={(value: string): void => {
                                    setMinIncludedDistance(Number(value));
                                }}
                            />
                        </div>
                        <div className="MaxExcludedDistanceInput">
                            <DrillConfigurationTextInput
                                label={"Maximum Excluded Distance"}
                                type={"number"}
                                value={maxExcludedDistance}
                                maxLength={3}
                                handleOnChange={(value: string): void => {
                                    setMaxExcludedDistance(Number(value));
                                }}
                            />
                        </div>
                        <div className="NumberOfShotsInput">
                            <NumberPlusMinusInput
                                label="Number of Shots"
                                value={props.selectedDrillConfiguration.numberOfShots}
                                handleOnClick={(numberOfShots: number): void => {
                                    const drillConfigurationClone: IDrillConfiguration = {...props.selectedDrillConfiguration};
                                    // drillConfigurationClone.setNumberOfShots(numberOfShots);
                                }}
                            />
                        </div>
                    </>
                    : [FIXED_DISTANCES_GENERATOR, RANDOM_FROM_FIXED_DISTANCES_GENERATOR].includes(distanceGenerators[distanceGeneratorIndex])
                        ? <>
                            <div className="DistancesInput">
                                <DrillConfigurationTextInput
                                    label={"Distances"}
                                    type={"text"}
                                    value={distances.join(", ")}
                                    maxLength={80}
                                    handleOnChange={(value: string): void => {
                                        // setDistances(value);
                                    }}
                                />
                            </div>
                            <div className="NumberOfRoundsInput">
                                <NumberPlusMinusInput
                                    label="Number of Rounds"
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

            <div className="top-buttons-flex-item">
                <div className="edit-flex-item flex-item">
                        <span className="edit-span"
                              onClick={(): void => {
                                  console.log("TODO")
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
                <div className="back-flex-item flex-item">
                        <span className="back-span"
                              onClick={(): void => {
                                  // save changes
                                  const newDrillConfiguration: IDrillConfiguration =
                                      createNewDrillConfigurationWithDistanceGenerator(
                                          props.selectedDrillConfiguration.getUuid(),
                                          name,
                                          description,
                                          unit,
                                          props.selectedDrillConfiguration,
                                          distanceGenerators[distanceGeneratorIndex],
                                          props.averageStrokesDataMap);
                                  props.handleSaveDrillConfigurations(newDrillConfiguration);

                                  // back to drill selection page
                                  props.handleSelectPageClicked(SelectDrillPageName)
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
    );
}
