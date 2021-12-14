import React from "react";
import './EndGroundTypeTable.scss';
import {IEndGroundType} from "../../../model/DrillConfiguration/DrillConfiguration";
import addRowIcon from "../../../../assets/edit.png";
import deleteRowIcon from "../../../../assets/back.png";

export interface IEndGroundTypeTableProps {
    label: string;
    endGroundTypes: IEndGroundType[];
    groundTypesAsString: string[];
}

export const EndGroundTypeTable: React.FC<IEndGroundTypeTableProps> = (props: IEndGroundTypeTableProps): any => {
    return <div className="end-ground-types-table-container">
        <label
            className="end-ground-types-table-label"
            htmlFor="end-ground-types-table">{props.label}
        </label>
        <div className="end-ground-types-table"
            // style={{flex: 1, flexDirection: "column"}}
        >
            {props.endGroundTypes.map((endGroundType: IEndGroundType) =>
                <>
                    <div className="end-ground-types-table-row"
                         style={{flex: 1, backgroundColor: "red"}}>
                        Trennzeile
                    </div>
                    <div className="end-ground-types-table-row">
                        <div className="end-ground-types-table-cell">
                            <select
                                id="end-ground-types-select"
                                className="end-ground-types-select"
                                // className="end-ground-types-select select-css"
                                defaultValue={props.groundTypesAsString.indexOf(endGroundType.type)}
                                onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                                    // CRTODO
                                }}
                            >
                                {
                                    props.groundTypesAsString.map((value: string, index: number) => {
                                        return (
                                            <option
                                                key={`value_${index}`}
                                                value={index}
                                            >
                                                {value}
                                            </option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className="end-ground-types-table-cell"
                             style={{flex: 1, backgroundColor: "blue"}}>
                            <input
                                className="drill-configuration-text-input input-css"
                                type="number"
                                value={endGroundType.to}
                                maxLength={3}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                    // CRTODO
                                }}
                            />
                        </div>
                        <div className="end-ground-types-table-icon-cell"
                             style={{backgroundColor: "green"}}>
                            <div className="add-flex-item icon-flex-item">
                                <span className="add-span"
                                      onClick={(): void => {
                                          console.log("TODO add row")
                                      }}
                                >
                                    <div className="table-button-img-div">
                                        <img className="table-button-img"
                                             src={addRowIcon}
                                             alt="Add Row"
                                        />
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div className="end-ground-types-table-icon-cell"
                             style={{backgroundColor: "blue"}}>
                            <div className="delete-flex-item icon-flex-item">
                                <span className="delete-span"
                                      onClick={(): void => {
                                          console.log("TODO delete row")
                                      }}
                                >
                                    <div className="table-button-img-div">
                                        <img className="table-button-img"
                                             src={deleteRowIcon}
                                             alt="Delete Row"
                                        />
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    </div>
}
