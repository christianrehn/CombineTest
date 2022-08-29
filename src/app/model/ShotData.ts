import {Unit} from "mathjs";

export interface IShotData {
    id: number,
    club: string,
    clubHeadSpeed: Unit,
    carry: Unit,
    totalDistance: Unit,
    offline: Unit,
    totalSpin: number,
    sideSpin: number,
    backSpin: number,
    targetDistance: Unit,
}
