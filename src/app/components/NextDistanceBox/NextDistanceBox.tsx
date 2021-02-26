import React from "react";

export interface INextDistanceBoxProps {
    nextDistance: number,
    restart: () => void
}

export const NextDistanceBox: React.FC<INextDistanceBoxProps> = (props: INextDistanceBoxProps): JSX.Element => {
    return !!props.nextDistance
        ? <div className="main-page__next-distance main-page__box">
            <p className="main-page__next-distance-number">{props.nextDistance}</p>
            <p className="main-page__next-distance-unit">Meter</p>
        </div>
        : <button className="main-page__restart main-page__box" onClick={(): void => {
            props.restart();
        }}>
            Restart
        </button>;
}
