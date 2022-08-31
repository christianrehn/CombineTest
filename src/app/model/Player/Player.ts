import {Entity, IEntity} from "../base/Entity";

export interface IPlayer extends IEntity {
    getLastname: () => string;
    getFirstname: () => string;
    getName: () => string;
}

export class Player extends Entity implements IPlayer {
    protected _lastname: string;
    protected _firstname: string;

    constructor(
        uuid: string,
        lastname: string,
        firstname: string,
    ) {
        super(uuid);

        this._lastname = lastname;
        this._firstname = firstname;
    }

    public getLastname = (): string => {
        return this._lastname;
    }
    public getFirstname = (): string => {
        return this._firstname;
    }

    public getName = (): string => {
        return `${this._lastname}, ${this._firstname}`;
    }

    public toJson = (): any => {
        return {
            uuid: this.getUuid(),
            lastname: this.getLastname(),
            firstname: this.getFirstname(),
        }
    }
}
