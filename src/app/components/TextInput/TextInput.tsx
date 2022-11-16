import React from "react";
import './TextInput.scss';

export interface ITextInputProps {
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

export const TextInput: React.FC<ITextInputProps> = (props: ITextInputProps): any => {
    return (props.hidden ? null :
            <div className="text-input-container">
                <label
                    className="text-input-label"
                    htmlFor="text-input">{props.label}
                </label>
                <div className="text-input-box">
                    <input
                        className={`text-input input-css ${props.error ? "error " : ""} ${props.type === "checkbox" ? "drill-configuration-checkbox" : ""}`}
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
