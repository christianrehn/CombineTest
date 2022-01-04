import React from "react";
import './EndGroundConfigsTable.scss';
import {IEndGroundConfig} from "../../../model/DrillConfiguration/DrillConfiguration";
import addRowIcon from "../../../../assets/addRow.png";
import deleteRowIcon from "../../../../assets/deleteRow.png";
import {assert} from "chai";
import {endGroundTypes} from "../../../model/AverageStrokesData/GroundType";

export interface IEndGroundConfigsTableProps {
    label: string;
    endGroundConfigs: IEndGroundConfig[];
    handleEndGroundConfigChanged: (endGroundConfig: IEndGroundConfig, endGroundConfigsIndex: number, newNotChanged: boolean) => void;
}

export const EndGroundConfigsTable: React.FC<IEndGroundConfigsTableProps> = (props: IEndGroundConfigsTableProps): any => {
    return (
        <div className="end-ground-configs-table-container">
            <label
                className="end-ground-configs-table-label"
                htmlFor="end-ground-configs-table">{props.label}
            </label>
            <div id="end-ground-configs-table" className="end-ground-configs-table">
                {props.endGroundConfigs.map((endGroundConfig: IEndGroundConfig, index: number) =>
                    <div key={`endGroundConfig_${index}`}>
                        <div className="end-ground-configs-table-row">
                            <div className="end-ground-configs-table-cell">
                                <select
                                    className="end-ground-configs-select select-css"
                                    value={endGroundConfig.type}
                                    onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                                        assert(!!props.endGroundConfigs, "!props.endGroundConfigs");

                                        // create endGroundConfig clone
                                        const endGroundConfigClone: IEndGroundConfig = {...props.endGroundConfigs[index]};
                                        endGroundConfigClone.type = String(event.target.value);

                                        // trigger handler
                                        props.handleEndGroundConfigChanged(endGroundConfigClone, index, false);
                                    }}
                                >
                                    {
                                        endGroundTypes.map((endGroundType: string, idx: number) => {
                                            return (
                                                <option
                                                    key={`endGroundType_${idx}`}
                                                    value={endGroundType}
                                                >
                                                    {endGroundType}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <div className="end-ground-configs-table-cell">
                                <input
                                    className="end-ground-configs-text-input input-css"
                                    type="number"
                                    required={false}
                                    placeholder="infinite"
                                    value={endGroundConfig.to}
                                    maxLength={3}
                                    min={1}
                                    max={999}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                        const value: string = String(event.target.value);
                                        if (value.length > 3) {
                                            event.preventDefault();
                                            event.stopPropagation();
                                        } else {
                                            const endGroundConfigClone: IEndGroundConfig = {...props.endGroundConfigs[index]};
                                            endGroundConfigClone.to = !!value ? Number(value) : undefined;
                                            props.handleEndGroundConfigChanged(endGroundConfigClone, index, false);
                                        }
                                    }}
                                />
                            </div>
                            <div className="end-ground-configs-table-icon-cell">
                                <div className="delete-row-flex-item icon-flex-item">
                                <span className="delete-row-span"
                                      onClick={(): void => {
                                          props.handleEndGroundConfigChanged(null, index, false);
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
                            <div className="end-ground-configs-table-icon-cell">
                                <div className="add-row-flex-item icon-flex-item">
                                <span className="add-row-span"
                                      onClick={(): void => {
                                          const newEndGroundConfig: IEndGroundConfig = {...props.endGroundConfigs[index]};
                                          props.handleEndGroundConfigChanged(newEndGroundConfig, index, true);
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
