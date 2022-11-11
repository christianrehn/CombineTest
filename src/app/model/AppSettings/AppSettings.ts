import {Entity, IEntity} from "../base/Entity";

export interface IAppSettings extends IEntity {
    getShotsUpdateType: () => string;
}

export class AppSettings extends Entity implements IAppSettings {
    protected _shotsUpdateType: string;

    constructor(
        uuid: string,
        shotsUpdateType: string,
    ) {
        super(uuid);

        this._shotsUpdateType = shotsUpdateType;
    }

    public getShotsUpdateType = (): string => {
        return this._shotsUpdateType;
    }

    public getName = (): string => {
        return this._uuid;
    }

    public toJson = (): any => {
        return {
            uuid: this.getUuid(),
            shotsUpdateType: this.getShotsUpdateType(),
        }
    }
}
