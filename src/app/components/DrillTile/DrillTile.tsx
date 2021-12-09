import React from "react";
import './DrillTile.scss';
import {IDrillConfiguration} from "../../model/DrillConfiguration";

export interface IDrillTileProps {
    distancesGenerator: IDrillConfiguration;
    editMode: boolean;
    handleTileClicked: (distancesGenerator: IDrillConfiguration) => void;
}

export const DrillTile: React.FC<IDrillTileProps> = (props: IDrillTileProps): JSX.Element => {
    return (
        <div className={props.editMode ? "drill-tile-flex-item drill-tile-shake" : "drill-tile-flex-item"}
             onClick={(): void => {
                 props.handleTileClicked(props.distancesGenerator);
             }}>
            <div className="drill-tile-name">
                {props.distancesGenerator.name}
            </div>
            <div className="drill-tile-description">
                {props.distancesGenerator.description}
            </div>
        </div>
    );
}
