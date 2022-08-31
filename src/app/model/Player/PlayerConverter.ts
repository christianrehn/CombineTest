import {assert} from "chai";
import {IPlayer, Player} from "./Player";

export const playersToString = (
    players: IPlayer[],
): string => {
    assert(players !== undefined, "players === undefined");
    assert(players !== null, "players === null");

    const playersAsJson: any[] = players.map((player: IPlayer) => {
        return player.toJson();
    });
    return JSON.stringify(playersAsJson);
}

export const playersFromJson = (
    playersAsJson: any[],
): IPlayer[] => {
    assert(playersAsJson !== undefined, "playersAsJson === undefined");
    assert(playersAsJson !== null, "playersAsJson === null");

    return playersAsJson
        .map((playerAsJson: any): IPlayer => {
            return new Player(playerAsJson.uuid, playerAsJson.lastname, playerAsJson.firstname)
        })
        .filter((player: IPlayer) => !!player);
}
