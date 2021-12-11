import React from 'react';
import './SelectDrillPage.scss';
import {IDrillConfiguration} from "../../model/drillconfiguration/DrillConfiguration";
import editIcon from '../../../assets/edit.png';
import glassesIcon from "../../../assets/glasses.png";
import exitIcon from '../../../assets/exit.png';
import {DrillPageName} from "../DrillPage/DrillPage";
import {DrillTile} from "../../components/DrillTile/DrillTile";
import {ipcRenderer} from "electron";
import {
    EditDrillConfigurationPage,
    EditDrillConfigurationPageName
} from "../EditDrillConfigurationPage/EditDrillConfigurationPage";

export const SelectDrillPageName: string = "SelectDrillPage";

interface ISelectDrillPageProps {
    drillConfigurations: IDrillConfiguration[];
    handleDrillConfigurationsChanged: (drillConfigurations: IDrillConfiguration[]) => void;
    selectedDrillConfiguration: IDrillConfiguration;
    handleSelectedDrillConfigurationChanged: (drillConfiguration: IDrillConfiguration) => void;
    handleSelectPageClicked: (page: string) => void;
}

export const SelectDrillPage: React.FC<ISelectDrillPageProps> = (props: ISelectDrillPageProps): JSX.Element => {
    const [distancesGenerator, setDistancesGenerator] = React.useState<IDrillConfiguration>(props.selectedDrillConfiguration);
    const [editMode, setEditMode] = React.useState<boolean>(false);

    return (
        <div className="select-drill-page page">
            <div className="select-drill-top">
                <div className="select-drill-flex-item flex-item">
                    <div className="page-header">
                        <h3>Select Drill</h3>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
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
                    <div className="exit-flex-item flex-item">
                        <span className="exit-span"
                              onClick={(): void => {
                                  ipcRenderer.sendSync('quit', 'undefined');
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={exitIcon}
                                     alt="Exit"
                                />
                            </div>
                        </span>
                    </div>
                </div>
            </div>

            <div className="drill-tiles-flex-item">
                {props.drillConfigurations.map((distancesGenerator: IDrillConfiguration, index: number) =>
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
                {editMode ?
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
