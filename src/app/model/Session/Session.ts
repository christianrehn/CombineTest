import {IDrillConfiguration} from "../DrillConfiguration/DrillConfiguration";
import {IShotData} from "../ShotData";

export interface ISession {
    drillConfiguration: IDrillConfiguration;
    shotDatas: IShotData[];
}
