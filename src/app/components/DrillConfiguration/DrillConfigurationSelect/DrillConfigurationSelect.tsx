import React from "react";
import './DrillConfigurationSelect.scss';
import {GroundTypeEnum, StartGroundTypeEnumsType} from "../../../model/AverageStrokesData/GroundTypeEnum";
import {assert} from "chai";
import {enumKeys} from "../../../helpers/enumHelper";

export interface IDrillConfigurationSelectProps {
    label: string;
    index: number;
    stringValues?: string[];
    startGroundTypeEnums?: StartGroundTypeEnumsType[];
    handleOnChange: (indexOrStartGroundTypeEnumNumberKey: number) => void;
}

export const DrillConfigurationSelect: React.FC<IDrillConfigurationSelectProps> = (props: IDrillConfigurationSelectProps): JSX.Element => {
    assert((!!props.stringValues && !props.startGroundTypeEnums) || (!props.stringValues && !!props.startGroundTypeEnums));

    return (
        <div className="drill-configuration-select-container">
            <label
                className="drill-configuration-select-label"
                htmlFor="drill-configuration-select">{props.label}
            </label>
            <select
                id="drill-configuration-select"
                className="drill-configuration-select select-css"
                defaultValue={props.index}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                    props.handleOnChange(Number(event.target.value));
                }}
            >
                {!!props.stringValues
                    ? props.stringValues.map((value: string, index: number) => {
                        return (
                            <option
                                key={`value_${index}`}
                                value={index}
                            >
                                {value}
                            </option>
                        );
                    })
                    : enumKeys(GroundTypeEnum).map((startGroundTypeEnumKey) => {
                        const groundTypeEnumNumberKey: number = GroundTypeEnum[startGroundTypeEnumKey];
                        return (
                            <option
                                key={`value_${groundTypeEnumNumberKey}`}
                                value={groundTypeEnumNumberKey}
                            >
                                {startGroundTypeEnumKey}
                            </option>
                        );
                    })
                }
            </select>
        </div>);
}
