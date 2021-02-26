import React from "react";
import './NextDistanceBox.scss';

export interface INextDistanceBoxProps {
    nextDistance: number,
    restart: () => void
}

export const NextDistanceBox: React.FC<INextDistanceBoxProps> = (props: INextDistanceBoxProps): JSX.Element => {
    return !!props.nextDistance
        ? <div className="next-distance box">
            <p className="next-distance-number">{props.nextDistance}</p>
            <p className="next-distance-unit">Meter</p>
        </div>
        : <button className="restart box" onClick={(): void => {
            props.restart();
        }}>
            Restart
        </button>;
}
