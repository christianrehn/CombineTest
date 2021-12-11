import React from "react";
import './DrillTile.scss';
import {IDrillConfiguration} from "../../model/drillconfiguration/DrillConfiguration";

export interface IDrillTileProps {
    drillConfiguration: IDrillConfiguration;
    editMode: boolean;
    handleTileClicked: (drillConfiguration: IDrillConfiguration) => void;
}

export const DrillTile: React.FC<IDrillTileProps> = (props: IDrillTileProps): JSX.Element => {
    return (
        <div className={props.editMode ? "drill-tile-flex-item drill-tile-shake" : "drill-tile-flex-item"}
             onClick={(): void => {
                 props.handleTileClicked(props.drillConfiguration)
             }}>
            <div className={!!props.drillConfiguration ? "drill-tile-name" : "drill-tile-new"}>
                {!!props.drillConfiguration ? props.drillConfiguration.name : "+"}
            </div>
            <div className="drill-tile-description">
                {!!props.drillConfiguration ? props.drillConfiguration.description : "Create new Drill Configuration"}
            </div>
        </div>
    );
}
