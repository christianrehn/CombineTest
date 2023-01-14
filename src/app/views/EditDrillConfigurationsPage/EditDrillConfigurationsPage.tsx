import React from 'react';
import './EditDrillConfigurationsPage.scss';
import {IDrillConfiguration} from "../../model/DrillConfiguration/DrillConfiguration";
import {assert} from "chai";
import {PageNamesType} from "../PageNamesType";

export const EditDrillConfigurationsPageName: PageNamesType = "EditDrillConfigurationsPage";


interface IEditDrillConfigurationsPageProps {
    allDrillConfigurations: IDrillConfiguration[];
    handleBackClicked: () => void;
    handleSaveDrillConfigurations: (allDrillConfigurations: IDrillConfiguration[]) => void;
}

export const EditDrillConfigurationsPage: React.FC<IEditDrillConfigurationsPageProps> = (props: IEditDrillConfigurationsPageProps): JSX.Element => {
    assert(!!props.allDrillConfigurations, "EditDrillConfigurationPage - !props.allDrillConfigurations");
    assert(!!props.handleBackClicked, "EditDrillConfigurationPage - !props.handleBackClicked");
    assert(!!props.handleSaveDrillConfigurations, "EditDrillConfigurationPage - !props.selectedDrillConfiguration");
    console.log("EditDrillConfigurationsPage - props.allDrillConfigurations", props.allDrillConfigurations);

    return <div>TODO: change order, deactive, ... drill configs</div>

}
