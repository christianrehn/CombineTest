import React from "react";
import './DrillConfigurationTextInput.scss';

export interface IDrillConfigurationTextInputProps {
    label: string;
    type: string;
    value?: string | number | undefined;
    checked?: boolean | undefined;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    error?: boolean;
    hidden?: boolean;
    handleOnChange: (value: string) => void;
}

export const DrillConfigurationTextInput: React.FC<IDrillConfigurationTextInputProps> = (props: IDrillConfigurationTextInputProps): any => {
    return (props.hidden ? null :
            <div className="drill-configuration-text-input-container">
                <label
                    className="drill-configuration-text-input-label"
                    htmlFor="drill-configuration-text-input">{props.label}
                </label>
                <div className="drill-configuration-text-input-box">
                    <input
                        className={`drill-configuration-text-input input-css ${props.error ? "error " : ""} ${props.type === "checkbox" ? "drill-configuration-checkbox" : ""}`}
                        type={props.type}
                        value={props.value}
                        checked={props.checked}
                        minLength={props.minLength}
                        maxLength={props.maxLength}
                        min={props.min}
                        max={props.max}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                            const value: string = String(event.target.value);
                            if ((!!props.maxLength && value.length > props.maxLength)) {
                                event.preventDefault();
                                event.stopPropagation();
                            } else {
                                props.handleOnChange(String(event.target.value));
                            }
                        }}
                    />
                </div>
            </div>
    );

}
