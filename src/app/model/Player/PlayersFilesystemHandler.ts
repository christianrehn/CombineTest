import {ipcRenderer} from "electron";
import {IPlayer} from "./Player";
import {playersToString} from "./PlayerConverter";

type LoadPlayersAsStringReturnType = { playersFilename: string, playersAsString: string }
export type LoadPlayersAsJsonReturnType = { playersFilename: string, playersAsJson: any[] }

export const loadPlayersAsJson = (): LoadPlayersAsJsonReturnType => {
    const {
        playersFilename,
        playersAsString
    }: LoadPlayersAsStringReturnType = ipcRenderer.sendSync('loadPlayersAsString', undefined);
    if (!playersAsString) {
        console.log("loadPlayersAsJson - no players file found");
        return {
            playersFilename,
            playersAsJson: [],
        };
    }
    const playersAsJson = JSON.parse(playersAsString);
    console.log("loadPlayersAsJson - playersAsJson=", playersAsJson)
    return {playersFilename, playersAsJson};
}

export const savePlayers = (players: IPlayer[]): void => {
    console.log("savePlayers - players=", players);

    const playersAsString: string = playersToString(players);
    const success = ipcRenderer.sendSync('savePlayers', playersAsString);
    console.log("savePlayers - success=", success);
}
