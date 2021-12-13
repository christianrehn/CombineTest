import React from "react";
import './DrillConfigurationTextInput.scss';
import {assert} from "chai";

export interface IDrillConfigurationTextInputProps {
    label: string;
    value: string;
    maxLength: number;
    handleOnChange: (value: string) => void;
}

export const DrillConfigurationTextInput: React.FC<IDrillConfigurationTextInputProps> = (props: IDrillConfigurationTextInputProps): any => {
    assert(!!props.value, "!props.value");

    return (
        <div className="drill-configuration-text-input-container">
            <label
                className="drill-configuration-text-input-label"
                htmlFor="drill-configuration-text-input">{props.label}
            </label>
            <div className="drill-configuration-text-input-box">
                <input
                    className="drill-configuration-text-input input-css"
                    type="text"
                    value={props.value}
                    maxLength={props.maxLength}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                        props.handleOnChange(event.target.value);
                    }}
                />
            </div>
        </div>
    );

}
