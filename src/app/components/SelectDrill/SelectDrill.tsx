import React from 'react';
import './SelectDrill.scss';
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import editIcon from '../../../assets/edit.png';
import glassesIcon from "../../../assets/glasses.png";
import {DrillTile} from "../DrillTile/DrillTile";
import {EditDrillConfigurationPageName} from "../../views/EditDrillConfigurationPage/EditDrillConfigurationPage";
import {DrillPageName} from "../../views/DrillPage/DrillPage";

interface ISelectDrillProps {
    drillConfigurations: IDrillConfiguration[];
    handleDrillConfigurationsChanged: (drillConfigurations: IDrillConfiguration[]) => void;
    selectedDrillConfiguration: IDrillConfiguration;
    handleSelectedDrillConfigurationChanged: (drillConfiguration: IDrillConfiguration) => void;
    handleSelectPageClicked: (page: string) => void;
}

export const SelectDrill: React.FC<ISelectDrillProps> = (props: ISelectDrillProps): JSX.Element => {
    const [editMode, setEditMode] = React.useState<boolean>(false);

    return (
        <div className="select-drill-page page">
            <div className="select-drill-top">
                <div className="select-drill-flex-item">
                    <div className="column-header">
                        <h3>Drills</h3>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
                    {/*<div className="reports-flex-item flex-item">*/}
                    {/*    <span className="reports-span"*/}
                    {/*          onClick={(): void => {*/}
                    {/*              props.handleSelectPageClicked(ReportsPageName)*/}
                    {/*          }}*/}
                    {/*    >*/}

                    {/*        <div className="top-button-img-div">*/}
                    {/*            <img className="top-button-img"*/}
                    {/*                 src={reportsIcon}*/}
                    {/*                 alt={"Reports"}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </span>*/}
                    {/*</div>*/}
                    <div className="edit-flex-item flex-item">
                        <span className="edit-span"
                              onClick={(): void => {
                                  setEditMode(!editMode);
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={editMode ? glassesIcon : editIcon}
                                     alt={editMode ? "Show" : "Edit"}
                                />
                            </div>
                        </span>
                    </div>
                </div>
            </div>

            <div className="drill-tiles-flex-item">
                { // existing configurations
                    props.drillConfigurations.map((distancesGenerator: IDrillConfiguration, index: number) =>
                        <DrillTile
                            key={`DrillTile_${index}`}
                            drillConfiguration={distancesGenerator}
                            editMode={editMode}
                            handleTileClicked={(distancesGenerator: IDrillConfiguration): void => {
                                // set selected distancesGenerator
                                props.handleSelectedDrillConfigurationChanged(distancesGenerator);
                                // switch to other page
                                props.handleSelectPageClicked(editMode ? EditDrillConfigurationPageName : DrillPageName);
                            }}
                        />)
                }
                { // additional tile to add a new configuration
                    editMode ?
                        <DrillTile
                            drillConfiguration={null}
                            editMode={editMode}
                            handleTileClicked={
                                (distancesGenerator: IDrillConfiguration): void => {
                                    // set selected distancesGenerator
                                    props.handleSelectedDrillConfigurationChanged(distancesGenerator);
                                    // switch to other page
                                    props.handleSelectPageClicked(EditDrillConfigurationPageName);
                                }}
                        />
                        : null
                }
            </div>
        </div>
    );
}
