import {IDrillConfiguration} from "../DrillConfiguration/DrillConfiguration";
import {IShotData} from "../ShotData/ShotData";
import {Entity, IEntity} from "../base/Entity";
import {assert} from "chai";

export interface ISession extends IEntity {
    getPlayerUuid: () => string;
    getDrillConfiguration: () => IDrillConfiguration;
    getShotDatas: () => IShotData[];
}

export class Session extends Entity implements ISession {
    protected _name: string;
    protected _playerUuid: string;
    protected _drillConfiguration: IDrillConfiguration;
    protected _shotDatas: IShotData[];

    constructor(
        uuid: string,
        name: string,
        playerUuid: string,
        drillConfiguration: IDrillConfiguration,
        shotDatas: IShotData[],
    ) {
        assert(!!uuid, "!uuid");
        assert(!!name, "!name");
        assert(!!playerUuid, "!playerUuid");
        assert(!!drillConfiguration, "!drillConfiguration");
        assert(!!shotDatas, "!shotDatas");

        super(uuid);

        this._name = name;
        this._playerUuid = playerUuid;
        this._drillConfiguration = drillConfiguration;
        this._shotDatas = shotDatas;
    }

    public getName(): string {
        assert(!!this._name, "getName - !this._name");

        return this._name;
    }

    public getPlayerUuid(): string {
        assert(!!this._playerUuid, "getPlayerUuid - !this._playerUuid");

        return this._playerUuid;
    }

    public getDrillConfiguration(): IDrillConfiguration {
        assert(!!this._drillConfiguration, "getDrillConfiguration - !this._drillConfiguration");

        return this._drillConfiguration;
    }

    public getShotDatas(): IShotData[] {
        return this._shotDatas;
    }

    public toJson(): any {
        return {
            uuid: this.getUuid(),
            name: this.getName(),
            playerUuid: this.getPlayerUuid(),
            drillConfiguration: this.getDrillConfiguration().toJson(),
            shotDatas: this.getShotDatas().map((shotData: IShotData) => shotData.toJson()),
        }
    }
}
