import React from 'react';
import './EditDrillConfigurationPage.scss';
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import {
    DrillConfigurationTextInput
} from "../../components/DrillConfiguration/DrillConfigurationTextInput/DrillConfigurationTextInput";
import editIcon from "../../../assets/edit.png";
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
import {AverageStrokesDataGroundTypeEnum, IAverageStrokesData} from "../../model/AverageStrokesData";
import {NumberPlusMinusInput} from "../../components/DrillConfiguration/NumberPlusMinusInput/NumberPlusMinusInput";
import {EndGroundTypeTable} from "../../components/DrillConfiguration/EndGroundTypeTable/EndGroundTypeTable";

export const EditDrillConfigurationPageName: string = "EditDrillConfigurationPage";

interface IEditDrillConfigurationPageProps {
    drillConfigurations: IDrillConfiguration[];
    handleDrillConfigurationsChanged: (drillConfigurations: IDrillConfiguration[]) => void;
    selectedDrillConfiguration: IDrillConfiguration;
    handleSelectedDrillConfigurationChanged: (drillConfiguration: IDrillConfiguration) => void;
    handleSelectPageClicked: (page: string) => void;
    handleSaveDrillConfigurations: (changedDrillConfiguration: IDrillConfiguration) => void;
    averageStrokesDataMap: Map<AverageStrokesDataGroundTypeEnum, IAverageStrokesData>
}

export const EditDrillConfigurationPage: React.FC<IEditDrillConfigurationPageProps> = (props: IEditDrillConfigurationPageProps): JSX.Element => {
    assert(!!props.selectedDrillConfiguration, "!props.selectedDrillConfiguration");
    console.log("EditDrillConfigurationPage - props.selectedDrillConfiguration", props.selectedDrillConfiguration);

    const [distanceGeneratorIndex, setDistanceGeneratorIndex] = React.useState<number>(0);
    const [minIncludedDistance, setMinIncludedDistance] = React.useState<number>(0);
    const [maxExcludedDistance, setMaxExcludedDistance] = React.useState<number>(0);
    const [distances, setDistances] = React.useState<number[]>([0, 3, 6]);
    const [numberOfRounds, setNumberOfRounds] = React.useState<number>(0);

    const groundTypesAsString: string[] = Object.values(AverageStrokesDataGroundTypeEnum);
    console.log("EditDrillConfigurationPage - groundTypesAsString", groundTypesAsString);

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
                        value={props.selectedDrillConfiguration.getName()}
                        maxLength={10}
                        handleOnChange={(value: string): void => {
                            const drillConfigurationClone: IDrillConfiguration = {...props.selectedDrillConfiguration};
                            drillConfigurationClone.setName(value);
                            props.handleSelectedDrillConfigurationChanged(drillConfigurationClone);
                        }}
                    />
                </div>
                <div className="DescriptionInput">
                    <DrillConfigurationTextInput
                        label={"Description"}
                        type={"text"}
                        value={props.selectedDrillConfiguration.getDescription()}
                        maxLength={80}
                        handleOnChange={(value: string): void => {
                            const drillConfigurationClone: IDrillConfiguration = {...props.selectedDrillConfiguration};
                            drillConfigurationClone.setDescription(value);
                            props.handleSelectedDrillConfigurationChanged(drillConfigurationClone);
                        }}
                    />
                </div>
                <div className="UnitSelect">
                    <DrillConfigurationSelect
                        label={"Unit"}
                        index={lengthUnits.indexOf(props.selectedDrillConfiguration.getUnit())}
                        values={lengthUnits}
                        handleOnChange={(index: number): void => {
                            if (index >= 0) {
                                const drillConfigurationClone: IDrillConfiguration = {...props.selectedDrillConfiguration};
                                drillConfigurationClone.setUnit(lengthUnits[index]);
                                props.handleSelectedDrillConfigurationChanged(drillConfigurationClone);
                            }
                        }}
                    />
                </div>
                <div className="StartGroundTypeSelect">
                    <DrillConfigurationSelect
                        label={"Start Ground Type"}
                        index={groundTypesAsString.indexOf(props.selectedDrillConfiguration.getStartGroundType())}
                        values={groundTypesAsString}
                        handleOnChange={(index: number): void => {
                            if (index >= 0) {
                                const drillConfigurationClone: IDrillConfiguration = {...props.selectedDrillConfiguration};
                                drillConfigurationClone.setStartGroundType(groundTypesAsString[index]);
                                props.handleSelectedDrillConfigurationChanged(drillConfigurationClone);
                            }
                        }}
                    />
                </div>
                <div className="EndGroundTypeTable">
                    <EndGroundTypeTable
                        label="End Ground Types"
                        endGroundTypes={props.selectedDrillConfiguration.getEndGroundTypes()}
                        groundTypesAsString={groundTypesAsString}
                    />
                </div>
                <div className="DistanceGeneratorSelect">
                    <DrillConfigurationSelect
                        label={"Distance Generator"}
                        index={distanceGeneratorIndex}
                        values={distanceGenerators}
                        handleOnChange={(index: number): void => {
                            if (index >= 0) {
                                setDistanceGeneratorIndex(index)
                                console.log("distanceGenerators[index]", distanceGenerators[index])
                                const newdrillConfiguration: IDrillConfiguration =
                                    createNewDrillConfigurationWithDistanceGenerator(
                                        props.selectedDrillConfiguration,
                                        distanceGenerators[index],
                                        props.averageStrokesDataMap);
                                props.handleSelectedDrillConfigurationChanged(newdrillConfiguration);
                            }
                        }}
                    />
                </div>
                {distanceGenerators[distanceGeneratorIndex] === RANDOM_DISTANCES_GENERATOR
                    ? <>
                        <div className="MinIncludedDistanceInput">
                            <DrillConfigurationTextInput
                                label={"Minimum Included Distance"}
                                type={"number"}
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
                                    props.handleSelectedDrillConfigurationChanged(drillConfigurationClone);
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
                                     src={editIcon}
                                     alt="Edit"
                                />
                            </div>
                        </span>
                </div>
                <div className="back-flex-item flex-item">
                        <span className="back-span"
                              onClick={(): void => {
                                  props.handleSaveDrillConfigurations(props.selectedDrillConfiguration);
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
