import React from "react";
import './RestartButton.scss';

export interface IRestartButtonProps {
    handleRestartButtonClicked: () => void
}

export const RestartButton: React.FC<IRestartButtonProps> = (props: IRestartButtonProps): JSX.Element => {
    return (
        <div className="restart-button box">
        <span
            className="restart-button-span"
            onClick={props.handleRestartButtonClicked}>
            Restart
        </span>
        </div>);

}
