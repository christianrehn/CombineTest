import React from "react";
import './EndGroundTypeTable.scss';
import {IEndGroundType} from "../../../model/DrillConfiguration/DrillConfiguration";
import addRowIcon from "../../../../assets/addRow.png";
import deleteRowIcon from "../../../../assets/deleteRow.png";
import {assert} from "chai";
import {GroundTypeEnum, GroundTypeEnumStringsType} from "../../../model/AverageStrokesData/GroundTypeEnum";
import {enumKeys} from "../../../util/EnumUtil";

export interface IEndGroundTypeTableProps {
    label: string;
    endGroundTypes: IEndGroundType[];
    handleEndGroundTypeChanged: (endGroundType: IEndGroundType, endGroundTypesIndex: number, newNotChanged: boolean) => void;
}

export const EndGroundTypesTable: React.FC<IEndGroundTypeTableProps> = (props: IEndGroundTypeTableProps): any => {
    return (
        <div className="end-ground-types-table-container">
            <label
                className="end-ground-types-table-label"
                htmlFor="end-ground-types-table">{props.label}
            </label>
            <div id="end-ground-types-table" className="end-ground-types-table">
                {props.endGroundTypes.map((endGroundType: IEndGroundType, endGroundTypesIndex: number) =>
                    <div key={`endGroundType_${endGroundTypesIndex}`}>
                        <div className="end-ground-types-table-row">
                            <div className="end-ground-types-table-cell">
                                <select
                                    className="end-ground-types-select select-css"
                                    value={GroundTypeEnum[endGroundType.type]}
                                    onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                                        assert(!!props.endGroundTypes, "!props.endGroundTypes");

                                        // convert key to enum
                                        const groundTypeEnumNumberKey: number = Number(event.target.value);
                                        const endGroundTypeEnum: any = GroundTypeEnum[groundTypeEnumNumberKey];

                                        // create endGroundType clone
                                        const endGroundTypeClone: IEndGroundType = {...props.endGroundTypes[endGroundTypesIndex]};
                                        endGroundTypeClone.type = endGroundTypeEnum;

                                        // trigger handler
                                        props.handleEndGroundTypeChanged(endGroundTypeClone, endGroundTypesIndex, false);
                                    }}
                                >
                                    {
                                        enumKeys(GroundTypeEnum).map((groundTypeEnumKey: GroundTypeEnumStringsType) => {
                                            const groundTypeEnumNumberKey: number = GroundTypeEnum[groundTypeEnumKey];
                                            return (
                                                <option
                                                    key={`value_${groundTypeEnumNumberKey}`}
                                                    value={groundTypeEnumNumberKey}
                                                >
                                                    {groundTypeEnumKey}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <div className="end-ground-types-table-cell">
                                <input
                                    className="end-ground-types-text-input input-css"
                                    type="number"
                                    required={false}
                                    placeholder="infinite"
                                    value={endGroundType.to}
                                    maxLength={3}
                                    min={1}
                                    max={999}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                        const value: string = String(event.target.value);
                                        if (value.length > 3) {
                                            event.preventDefault();
                                            event.stopPropagation();
                                        } else {
                                            const endGroundTypeClone: IEndGroundType = {...props.endGroundTypes[endGroundTypesIndex]};
                                            endGroundTypeClone.to = !!value ? Number(value) : undefined;
                                            props.handleEndGroundTypeChanged(endGroundTypeClone, endGroundTypesIndex, false);
                                        }
                                    }}
                                />
                            </div>
                            <div className="end-ground-types-table-icon-cell">
                                <div className="delete-row-flex-item icon-flex-item">
                                <span className="delete-row-span"
                                      onClick={(): void => {
                                          props.handleEndGroundTypeChanged(null, endGroundTypesIndex, false);
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
                            <div className="end-ground-types-table-icon-cell">
                                <div className="add-row-flex-item icon-flex-item">
                                <span className="add-row-span"
                                      onClick={(): void => {
                                          const newEndGroundType: IEndGroundType = {...props.endGroundTypes[endGroundTypesIndex]};
                                          props.handleEndGroundTypeChanged(newEndGroundType, endGroundTypesIndex, true);
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
