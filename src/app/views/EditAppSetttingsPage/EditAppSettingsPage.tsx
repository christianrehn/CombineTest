import React from 'react';
import './EditAppSettingsPage.scss';
import backIcon from '../../../assets/back.png';
import {assert} from "chai";
import {
    DrillConfigurationSelect
} from "../../components/DrillConfiguration/DrillConfigurationSelect/DrillConfigurationSelect";
import {
    eventReadOnlyLatestShotsUpdateType,
    pollingShotsUpdateType,
    shotsUpdateTypes
} from "../../model/SelectValues/ShotsUpdateType";
import {AppSettings, IAppSettings} from "../../model/AppSettings/AppSettings";
import {NumberPlusMinusInput} from "../../components/NumberPlusMinusInput/NumberPlusMinusInput";
import {TextInput} from "../../components/TextInput/TextInput";

export const EditAppSettingsPageName: string = "EditSettingsPage";

const DEFAULT_SHOTS_UPDATE_TYPE: string = eventReadOnlyLatestShotsUpdateType;
const DEFAULT_POLLING_INTERVALL: number = 1000; // 1 second

interface EditAppSettingsPageProps {
    appSettings: IAppSettings;
    lastShotCsvPath: string;
    sessionJsonDir: string;
    handleBackClicked: () => void;
    handleSaveAppSettings: (changedAppSettings: IAppSettings) => void;
}

export const EditAppSettingsPage: React.FC<EditAppSettingsPageProps> = (props: EditAppSettingsPageProps): JSX.Element => {
    assert(!!props, "!!props")

    const [shotsUpdateType, setShotsUpdateType] = React.useState<string>(props.appSettings.getShotsUpdateType() || DEFAULT_SHOTS_UPDATE_TYPE);
    const [pollingInterval, setPollingInterval] = React.useState<number>(props.appSettings.getPollingInterval() || DEFAULT_POLLING_INTERVALL);

    return (
        <div className="edit-app-settings-page page">
            <div className="edit-app-settings-top">
                <div className="edit-app-settings-flex-item flex-item">
                    <div className="page-header">
                        <h3>Edit App Settings</h3>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
                    <div className="back-flex-item flex-item">
                        <span className="back-span"
                              onClick={(): void => {
                                  // save changes
                                  const newAppSettings: IAppSettings =
                                      new AppSettings(
                                          props.appSettings.getUuid(),
                                          shotsUpdateType,
                                          pollingInterval
                                      );
                                  props.handleSaveAppSettings(newAppSettings);

                                  // back to drill selection page
                                  props.handleBackClicked()
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={backIcon}
                                     alt="Back"
                                />
                            </div>
                        </span>
                    </div>
                </div>
            </div>

            <div className="edit-app-settings-input">
                <div className="last-shot-csv-path-input">
                    <TextInput
                        label={"Last Shot CSV Path"}
                        type={"text"}
                        value={props.lastShotCsvPath}
                        disabled={true}
                    />
                </div>
                <div className="session-json-dir-input">
                    <TextInput
                        label={"Session Json Directory"}
                        type={"text"}
                        value={props.sessionJsonDir}
                        disabled={true}
                    />
                </div>
                <div className="shots-update-type-select">
                    <DrillConfigurationSelect
                        label={"Shots Update Type"}
                        index={shotsUpdateTypes.indexOf(shotsUpdateType)}
                        stringValues={shotsUpdateTypes}
                        handleOnChange={(index: number): void => {
                            assert(index >= 0, "index < 0");
                            setShotsUpdateType(shotsUpdateTypes[index]);
                        }}
                    />
                </div>
                <div className="polling-interval-input">
                    <NumberPlusMinusInput
                        label={`Polling Intervall in milliseconds`}
                        hidden={![pollingShotsUpdateType].includes(shotsUpdateType)}
                        value={pollingInterval}
                        delta={100}
                        min={500}
                        handleOnClick={(value: number): void => {
                            setPollingInterval(value);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
