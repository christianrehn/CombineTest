import React from 'react';
import './SettingsPage.scss';
import mainIcon from "../../../assets/main.png";
import {ITestConfiguration} from "../../model/TestConfiguration";
import {TestConfigurationSelect} from "../../components/DistancesGeneratorSelect/TestConfigurationSelect";

interface ISettingsPageProps {
    distancesGenerators: ITestConfiguration[];
    handleDistancesGeneratorsChanged: (distancesGenerators: ITestConfiguration[]) => void;
    selectedDistancesGenerator: ITestConfiguration;
    handleDistancesGeneratorChanged: (selectedDistancesGenerator: ITestConfiguration) => void;
    handleMainClicked: () => void;
}

export const SettingsPage: React.FC<ISettingsPageProps> = (props: ISettingsPageProps): JSX.Element => {
    return (
        <div className="settings-page page">
            <div className="settings-flex-item flex-item">
                <div className="page-header">
                    <h3>Settings</h3>
                </div>
                <div className="DistancesGeneratorSelect">
                    <TestConfigurationSelect
                        testConfigurations={props.distancesGenerators}
                        selectedTestConfiguration={props.selectedDistancesGenerator}
                        handleTestConfigurationChanged={props.handleDistancesGeneratorChanged}
                    />
                </div>
            </div>

            <div className="page-change-flex-item flex-item">
                            <span className="page-change-span"
                                  onClick={(): void => {
                                      console.log(props.handleMainClicked())
                                  }}>
                <img className="page-change-img"
                     src={mainIcon}
                     alt="Settings"
                />
            </span>
            </div>
        </div>
    );
}
