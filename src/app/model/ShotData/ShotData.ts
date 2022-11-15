import * as math from "mathjs";
import {Unit} from "mathjs";
import {IShotDataX, ShotDataX} from "./ShotDataX";

export interface IShotData extends IShotDataX {
    getTargetDistance: () => Unit;
    toJson: () => any;
}

export class ShotData extends ShotDataX implements IShotData {
    protected _targetDistance: Unit;

    constructor(
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
    ) {
        super(
            id,
            club,
            clubHeadSpeed,
            carry,
            totalDistance,
            offline,
            totalSpin,
            sideSpin,
            backSpin);

        this._targetDistance = targetDistance;
    }

    public getTargetDistance = (): Unit => {
        return this._targetDistance;
    }

    public static fromLastShotCsvAsJson = (lastShotCsvAsJson: any, targetDistance: Unit): ShotData => {
        const shotData: ShotData = new ShotData(
            lastShotCsvAsJson["shot_id"],
            lastShotCsvAsJson["club"],
            math.unit(lastShotCsvAsJson["club_head_speed_ms"], "m"),
            math.unit(lastShotCsvAsJson["carry_m"], "m"),
            math.unit(lastShotCsvAsJson["total_distance_m"], "m"),
            math.unit(lastShotCsvAsJson["offline_m"], "m"),
            lastShotCsvAsJson["total_spin_rpm"],
            lastShotCsvAsJson["side_spin_rpm"],
            lastShotCsvAsJson["back_spin_rpm"],
            targetDistance
        );
        return shotData;
    }

    public toJson = (): any => {
        return {
            id: this.getId(),
            club: this.getClub(),
            clubHeadSpeed: this.getClubHeadSpeed().toJSON(),
            carry: this.getCarry().toJSON(),
            totalDistance: this.getTotalDistance().toJSON(),
            offline: this.getOffline().toJSON(),
            totalSpin: this.getTotalSpin(),
            sideSpin: this.getSideSpin(),
            backSpin: this.getBackSpin(),
            targetDistance: this.getTargetDistance().toJSON(),
        }
    }
}
