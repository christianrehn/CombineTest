import React from "react";
import './EndGroundTypeTable.scss';
import {IEndGroundType} from "../../../model/DrillConfiguration/DrillConfiguration";

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
                        <div className="end-ground-types-table-cell"
                             style={{flex: 1, backgroundColor: "green"}}>
                            3
                        </div>
                    </div>
                </>
            )}
        </div>
    </div>
}
