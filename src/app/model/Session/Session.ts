import {IDrillConfiguration} from "../DrillConfiguration/DrillConfiguration";
import {IShotData} from "../ShotData";

export interface ISession {
    getUuid: () => string;
    getPlayerUuid: () => string;
    getDrillConfiguration: () => IDrillConfiguration;
    getShotDatas: () => IShotData[];
}

export class Session implements ISession {
    protected _uuid: string;
    protected _playerUuid: string;
    protected _drillConfiguration: IDrillConfiguration;
    protected _shotDatas: IShotData[];

    constructor(
        uuid: string,
        playerUuid: string,
        drillConfiguration: IDrillConfiguration,
        shotDatas: IShotData[],
    ) {
        this._uuid = uuid;
        this._playerUuid = playerUuid;
        this._drillConfiguration = drillConfiguration;
        this._shotDatas = shotDatas;
    }

    public getUuid = (): string => {
        return this._uuid;
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
}
