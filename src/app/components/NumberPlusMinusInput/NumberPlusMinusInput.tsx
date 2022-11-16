import React from "react";
import './NumberPlusMinusInput.scss';
import * as math from "mathjs";

export interface NumberOfShotsInputProps {
    label: string;
    value: number;
    delta?: number;
    decimalPlaces?: number;
    min?: number;
    max?: number;
    hidden?: boolean;
    handleOnClick: (value: number) => void;
}

export const NumberPlusMinusInput: React.FC<NumberOfShotsInputProps> = (props: NumberOfShotsInputProps): any => {
    const delta: number = props.delta ?? 1;

    const computeNewValue = (minusNotPlus: boolean): number => {
        const newValue: number = minusNotPlus ? props.value - delta : props.value + delta;
        if (props.decimalPlaces > 0) {
            return math.round(newValue, props.decimalPlaces);
        }
        return newValue;
    }
    return (props.hidden ? null :
            <div className="number-plus-minus-input-container">
                <label
                    className="number-plus-minus-input-label"
                    htmlFor="number-plus-minus-input">{props.label}</label>
                <div className="btn-change-box">
                <span className="btn-change minus icon icon-minus"
                      onClick={(): void => {
                          const newValue: number = computeNewValue(true);
                          if (!props.min || newValue >= props.min) {
                              props.handleOnClick(newValue);
                          }
                      }}>
                    -
                </span>
                    <input
                        className="number-plus-minus-input input-css"
                        type="text"
                        value={props.value}
                        min="1"
                        readOnly={true}
                    />
                    <span className="btn-change plus icon icon-plus"
                          onClick={(): void => {
                              const newValue: number = computeNewValue(false);
                              if (!props.max || newValue <= props.max) {
                                  props.handleOnClick(newValue);
                              }
                          }}>
                    +
                </span>
                </div>
            </div>
    );

}
