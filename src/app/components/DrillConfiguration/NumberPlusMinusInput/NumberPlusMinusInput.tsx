import React from "react";
import './NumberOfShotsInput.scss';

export interface INumberOfShotsInputProps {
    label: string;
    value: number;
    min?: number;
    max?: number;
    hidden?: boolean;
    handleOnClick: (value: number) => void;
}

export const NumberPlusMinusInput: React.FC<INumberOfShotsInputProps> = (props: INumberOfShotsInputProps): any => {
    return (props.hidden ? null :
            <div className="number-of-shots-input-container">
                <label
                    className="number-of-shots-input-label"
                    htmlFor="number-of-shots-input">{props.label}</label>
                <div className="btn-change-box">
                <span className="btn-change minus icon icon-minus"
                      onClick={(): void => {
                          if (!props.min || props.value > props.min) {
                              props.handleOnClick(props.value - 1);
                          }
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
                              if (!props.max || props.value < props.max) {
                                  props.handleOnClick(props.value + 1);
                              }
                          }}>
                    +
                </span>
                </div>
            </div>
    );

}
