import {ipcRenderer} from "electron";
import {IPlayer} from "./Player";
import {playersToString} from "./PlayerConverter";

export const loadPlayersAsJson = (): any[] => {
    const playerAsString: string = ipcRenderer.sendSync('loadPlayersAsString', undefined);
    if (!playerAsString) {
        console.log("loadPlayersAsJson - no players file found");
        return [];
    }
    const playerAsJson = JSON.parse(playerAsString);
    console.log("loadPlayersAsJson - playerAsJson=", playerAsJson)
    return playerAsJson;
}

export const savePlayers = (players: IPlayer[]): void => {
    console.log("savePlayers - players=", players);

    const playersAsString: string = playersToString(players);
    const success = ipcRenderer.sendSync('savePlayers', playersAsString);
    console.log("savePlayers - success=", success);
}
