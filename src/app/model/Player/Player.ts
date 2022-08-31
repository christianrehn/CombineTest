export interface IPlayer {
    getUuid: () => string;
    getLastname: () => string;
    getFirstname: () => string;

}

export class Player implements IPlayer {
    protected _uuid: string;
    protected _lastname: string;
    protected _firstname: string;

    constructor(
        uuid: string,
        lastname: string,
        firstname: string,
    ) {
        this._uuid = uuid;
        this._lastname = lastname;
        this._firstname = firstname;
    }

    public getUuid = (): string => {
        return this._uuid;
    }

    public getLastname = (): string => {
        return this._lastname;
    }
    public getFirstname = (): string => {
        return this._firstname;
    }
}
