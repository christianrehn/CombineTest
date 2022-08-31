import {IDrillConfiguration} from "../DrillConfiguration/DrillConfiguration";
import {IShotData} from "../ShotData";
import {Entity, IEntity} from "../base/Entity";

export interface ISession extends IEntity {
    getPlayerUuid: () => string;
    getDrillConfiguration: () => IDrillConfiguration;
    getShotDatas: () => IShotData[];
}

export class Session extends Entity implements ISession {
    protected _playerUuid: string;
    protected _drillConfiguration: IDrillConfiguration;
    protected _shotDatas: IShotData[];

    constructor(
        uuid: string,
        playerUuid: string,
        drillConfiguration: IDrillConfiguration,
        shotDatas: IShotData[],
    ) {
        super(uuid);

        this._playerUuid = playerUuid;
        this._drillConfiguration = drillConfiguration;
        this._shotDatas = shotDatas;
    }

    public getPlayerUuid = (): string => {
        return this._playerUuid;
    }

    public getDrillConfiguration = (): IDrillConfiguration => {
        return this._drillConfiguration;
    }

    public getShotDatas = (): IShotData[] => {
        return this._shotDatas;
    }

    public toJson = (): any => {
        return {
            uuid: this.getUuid(),
            playerUuid: this.getPlayerUuid(),
            drillConfiguration: this.getDrillConfiguration(),
            shotDatas: this.getShotDatas(),
        }
    }
}
