import {IDrillConfiguration} from "../DrillConfiguration/DrillConfiguration";
import {IShotData} from "../ShotData";

export interface ISession {
    uuid: string;
    playerUuid: string;
    drillConfiguration: IDrillConfiguration;
    shotDatas: IShotData[];
}
