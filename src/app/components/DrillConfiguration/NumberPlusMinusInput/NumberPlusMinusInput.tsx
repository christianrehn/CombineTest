import React from "react";
import './NumberOfShotsInput.scss';

export interface INumberOfShotsInputProps {
    numberOfShots: number;
    handleNumberOfShotsChanged: (numberOfShots: number) => void;
}

export const NumberPlusMinusInput: React.FC<INumberOfShotsInputProps> = (props: INumberOfShotsInputProps): any => {
    return (
        <div className="number-of-shots-input-container">
            <label
                className="number-of-shots-input-label"
                htmlFor="number-of-shots-input">Number of Shots</label>
            <div className="btn-change-box">
                <span className="btn-change minus icon icon-minus"
                      onClick={(): void => {
                          props.handleNumberOfShotsChanged(props.numberOfShots - 1);
                      }}>
                    -
                </span>
                <input
                    className="number-of-shots-input input-css"
                    type="text"
                    value={props.numberOfShots}
                    min="1"
                    readOnly={true}
                />
                <span className="btn-change plus icon icon-plus"
                      onClick={(): void => {
                          props.handleNumberOfShotsChanged(props.numberOfShots + 1);
                      }}>
                    +
                </span>
            </div>
        </div>
    );

}
