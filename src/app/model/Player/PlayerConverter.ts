import {assert} from "chai";
import {IPlayer} from "./Player";

export const playersToString = (
    players: IPlayer[],
): string => {
    assert(players !== undefined, "players === undefined");
    assert(players !== null, "players === null");

    return JSON.stringify(players);
}

export const playersFromJson = (
    playersAsJson: any[],
): IPlayer[] => {
    assert(playersAsJson !== undefined, "playersAsJson === undefined");
    assert(playersAsJson !== null, "playersAsJson === null");

    return playersAsJson;
}
