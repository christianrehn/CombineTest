import React from 'react';
import './SettingsPage.scss';
import mainIcon from "../../../assets/main.png";
import {IDistancesGenerator} from "../../model/DistancesGenerator";
import {NextDistanceBox} from "../../components/NextDistanceBox/NextDistanceBox";
import {DistancesGeneratorSelect} from "../../components/DistancesGeneratorSelect/DistancesGeneratorSelect";
import {NumberOfShotsInput} from "../../components/NumberOfShotsInput/NumberOfShotsInput";

interface ISettingsPageProps {
    distancesGenerators: IDistancesGenerator[];
    handleDistancesGeneratorsChanged: (distancesGenerators: IDistancesGenerator[]) => void;
    selectedDistancesGenerator: IDistancesGenerator;
    handleDistancesGeneratorChanged: (selectedDistancesGenerator: IDistancesGenerator) => void;
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
                    <DistancesGeneratorSelect
                        distancesGenerators={props.distancesGenerators}
                        selectedDistancesGenerator={props.selectedDistancesGenerator}
                        handleDistancesGeneratorChanged={props.handleDistancesGeneratorChanged}
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
