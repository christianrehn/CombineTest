import React from 'react';
import './SelectDrillPage.scss';
import {IDrillConfiguration} from "../../model/DrillConfiguration";
import editIcon from '../../../assets/edit.png';
import exitIcon from '../../../assets/exit.png';
import {DrillPageName} from "../DrillPage/DrillPage";
import {DrillTile} from "../../components/DrillTile/DrillTile";
import {ipcRenderer} from "electron";

export const SelectDrillPageName: string = "SelectDrillPage";

interface ISelectDrillPageProps {
    distancesGenerators: IDrillConfiguration[];
    handleDistancesGeneratorsChanged: (distancesGenerators: IDrillConfiguration[]) => void;
    selectedDistancesGenerator: IDrillConfiguration;
    handleSelectedDistancesGeneratorChanged: (selectedDistancesGenerator: IDrillConfiguration) => void;
    handleSelectPageClicked: (page: string) => void;
}

export const SelectDrillPage: React.FC<ISelectDrillPageProps> = (props: ISelectDrillPageProps): JSX.Element => {
    const [distancesGenerator, setDistancesGenerator] = React.useState<IDrillConfiguration>(props.selectedDistancesGenerator);
    const [editMode, setEditMode] = React.useState<boolean>(false);

    return (
        <div className="select-drill-page page">
            <div className="select-drill-top">
                <div className="select-drill-flex-item flex-item">
                    <div className="page-header">
                        <h3>Select Drill</h3>
                    </div>
                </div>

                <div //className="page-buttons-flex-item flex-item"
                    style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                    <div className="edit-flex-item flex-item">
                        <span className="top-button-span"
                              onClick={(): void => {
                                  setEditMode(!editMode);
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
                    <div className="edit-flex-item flex-item">
                        <span className="page-top-button-span"
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
                {props.distancesGenerators.map((distancesGenerator: IDrillConfiguration) =>
                    <DrillTile
                        distancesGenerator={distancesGenerator}
                        editMode={editMode}
                        handleTileClicked={(distancesGenerator: IDrillConfiguration): void => {
                            props.handleSelectedDistancesGeneratorChanged(distancesGenerator);
                            props.handleSelectPageClicked(DrillPageName);
                        }}
                    />)
                }
            </div>
        </div>
    );
}
