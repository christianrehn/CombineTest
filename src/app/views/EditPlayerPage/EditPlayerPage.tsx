import React from 'react';
import './EditPlayerPage.scss';
import {TextInput} from "../../components/TextInput/TextInput";
import deleteIcon from "../../../assets/delete.png";
import backIcon from '../../../assets/back.png';
import {assert} from "chai";
import {IPlayer, Player} from "../../model/Player/Player";
import {PageNamesType} from "../PageNamesType";

export const EditPlayerPageName: PageNamesType = "EditPlayerPage";


const MIN_LASTNAME: number = 1;
const MAX_LASTNAME: number = 20;

const MIN_FIRSTNAME: number = 1;
const MAX_FIRSTNAME: number = 20;

interface EditPlayerPageProps {
    selectedPlayer: IPlayer;
    handleBackClicked: () => void;
    handleSavePlayer: (player: IPlayer) => void;
}

export const EditPlayerPage: React.FC<EditPlayerPageProps> = (props: EditPlayerPageProps): JSX.Element => {
    assert(!!props.selectedPlayer, "EditDrillConfigurationPage - !props.selectedPlayer");
    console.log("EditPlayerPage - props.selectedPlayer", props.selectedPlayer);

    const [lastname, setLastname] = React.useState<string>(props.selectedPlayer.getLastname());
    const [lastnameError, setLastnameError] = React.useState<boolean>(true);

    const [firstname, setFirstname] = React.useState<string>(props.selectedPlayer.getFirstname());
    const [firstnameError, setFirstnameError] = React.useState<boolean>(true);

    React.useEffect((): void => {
        // validate name
        setLastnameError(lastname.length < MIN_LASTNAME || lastname.length > MAX_LASTNAME);
    }, [lastname])

    React.useEffect((): void => {
        // validate name
        setFirstnameError(firstname.length < MIN_FIRSTNAME || firstname.length > MAX_FIRSTNAME);
    }, [firstname])

    const error = (): boolean => {
        return lastnameError || firstnameError;
    }

    return (
        <div className="edit-player-page page">
            <div className="edit-player-top">
                <div className="edit-player-flex-item flex-item">
                    <div className="page-header">
                        <h3>Edit Player</h3>
                    </div>
                </div>

                <div className="top-buttons-flex-item">
                    <div className="delete-flex-item flex-item">
                        <span className="delete-span"
                              onClick={(): void => {
                                  // save changes
                                  props.handleSavePlayer(undefined);

                                  // back to drill selection page
                                  props.handleBackClicked()
                              }}
                        >
                            <div className="top-button-img-div">
                                <img className="top-button-img"
                                     src={deleteIcon}
                                     alt="Delete Configuration"
                                />
                            </div>
                        </span>
                    </div>
                    <div className={error() ? "disabled back-flex-item flex-item" : "back-flex-item flex-item"}>
                        <span className="back-span"
                              onClick={(): void => {
                                  // save changes
                                  const newPlayer: IPlayer =
                                      new Player(
                                          props.selectedPlayer.getUuid(),
                                          lastname,
                                          firstname
                                      )
                                  ;
                                  props.handleSavePlayer(newPlayer);

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

            <div className="edit-player-input">
                <div className="lastname-input">
                    <TextInput
                        label={"Lastname"}
                        error={lastnameError}
                        type={"text"}
                        value={lastname}
                        minLength={MIN_LASTNAME}
                        maxLength={MAX_LASTNAME}
                        handleOnChange={(value: string): void => {
                            setLastname(value);
                        }}
                    />
                </div>
                <div className="firstname-input">
                    <TextInput
                        label={"Firstname"}
                        error={firstnameError}
                        type={"text"}
                        value={firstname}
                        minLength={MIN_FIRSTNAME}
                        maxLength={MAX_FIRSTNAME}
                        handleOnChange={(value: string): void => {
                            setFirstname(value);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
