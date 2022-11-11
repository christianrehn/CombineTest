import React from "react";
import './NumberOfShotsInput.scss';

export interface NumberOfShotsInputProps {
    label: string;
    value: number;
    delta?: number;
    min?: number;
    max?: number;
    hidden?: boolean;
    handleOnClick: (value: number) => void;
}

export const NumberPlusMinusInput: React.FC<NumberOfShotsInputProps> = (props: NumberOfShotsInputProps): any => {
    const delta: number = props.delta ?? 1;
    return (props.hidden ? null :
            <div className="number-of-shots-input-container">
                <label
                    className="number-of-shots-input-label"
                    htmlFor="number-of-shots-input">{props.label}</label>
                <div className="btn-change-box">
                <span className="btn-change minus icon icon-minus"
                      onClick={(): void => {
                          if (!props.min || props.value - delta >= props.min) {
                              props.handleOnClick(props.value - delta);
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
                              if (!props.max || props.value + delta <= props.max) {
                                  props.handleOnClick(props.value + delta);
                              }
                          }}>
                    +
                </span>
                </div>
            </div>
    );

}
