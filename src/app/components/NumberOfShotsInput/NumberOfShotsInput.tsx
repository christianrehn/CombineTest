import React from "react";
import './NumberOfShotsInput.scss';

export interface INumberOfShotsInputProps {
    value: number;
    onChange: (value: number) => void;
}

export const NumberOfShotsInput: React.FC<INumberOfShotsInputProps> = (props: INumberOfShotsInputProps): any => {
    return (
        <div className="number-of-shots-input-container">
            <label
                className="number-of-shots-input-label"
                htmlFor="number-of-shots-input">Number of Shots</label>
            <div className="btn-change-box">
                <span className="btn-change minus icon icon-minus"
                      onClick={(): void => {
                          props.onChange(props.value - 1);
                      }}>
                    -
                </span>
                <input
                    className="number-of-shots-input input-css"
                    type="text"
                    value={props.value}
                    min="1"
                    readOnly={true}
                />
                <span className="btn-change plus icon icon-plus"
                      onClick={(): void => {
                          props.onChange(props.value + 1);
                      }}>
                    +
                </span>
            </div>
        </div>
    );

}