import React from "react";
import './DescriptionInput.scss';

export interface IDescriptionInputProps {
    description: string;
    handleDescriptionChanged: (description: string) => void;
}

export const DescriptionInput: React.FC<IDescriptionInputProps> = (props: IDescriptionInputProps): any => {
    return (
        <div className="description-input-container">
            <label
                className="description-input-label"
                htmlFor="description-input">Beschreibung
            </label>
            <div className="description-input-box">
                <input
                    className="description-input input-css"
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
