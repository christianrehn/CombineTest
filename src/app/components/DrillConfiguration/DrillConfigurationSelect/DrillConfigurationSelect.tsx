import React from "react";
import './DrillConfigurationSelect.scss';

export interface ITestConfigurationSelectProps {
    label: string;
    index: number;
    values: string[];
    handleOnChange: (index: number) => void;
}

export const DrillConfigurationSelect: React.FC<ITestConfigurationSelectProps> = (props: ITestConfigurationSelectProps): JSX.Element => {
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
                {
                    props.values.map((value: string, index: number) => {
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
        </div>);
}
