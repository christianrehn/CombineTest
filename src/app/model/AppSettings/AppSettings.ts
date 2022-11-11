import {Entity, IEntity} from "../base/Entity";

export interface IAppSettings extends IEntity {
    getShotsUpdateType: () => string;
    getPollingInterval: () => number;
}

export class AppSettings extends Entity implements IAppSettings {
    protected _shotsUpdateType: string;
    protected _pollingInterval: number;

    constructor(
        uuid: string,
        shotsUpdateType: string,
        pollingInterval: number,
    ) {
        super(uuid);

        this._shotsUpdateType = shotsUpdateType;
        this._pollingInterval = pollingInterval;
    }

    public getShotsUpdateType = (): string => {
        return this._shotsUpdateType;
    }

    public getPollingInterval = (): number => {
        return this._pollingInterval;
    }

    public getName = (): string => {
        return this._uuid;
    }

    public toJson = (): any => {
        return {
            uuid: this.getUuid(),
            shotsUpdateType: this.getShotsUpdateType(),
            pollingInterval: this.getPollingInterval(),
        }
    }
}
