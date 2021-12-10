import React from "react";
import './DrillConfigurationTextInput.scss';

export interface IDrillConfigurationTextInputProps {
    description: string;
    handleDescriptionChanged: (description: string) => void;
}

export const DrillConfigurationTextInput: React.FC<IDrillConfigurationTextInputProps> = (props: IDrillConfigurationTextInputProps): any => {
    return (
        <div className="drill-configuration-text-input-container">
            <label
                className="drill-configuration-text-input-label"
                htmlFor="drill-configuration-text-input">Description
            </label>
            <div className="drill-configuration-text-input-box">
                <input
                    className="drill-configuration-text-input input-css"
                    type="text"
                    value={props.description}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                        props.handleDescriptionChanged(String(event.target.value));
                    }}
                />
            </div>
        </div>
    );

}
