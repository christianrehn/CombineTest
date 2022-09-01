import {Unit} from "mathjs";

export interface IShotData {
    getId: () => number;
    getClub: () => string;
    getClubHeadSpeed: () => Unit;
    getCarry: () => Unit;
    getTotalDistance: () => Unit;
    getOffline: () => Unit;
    getTotalSpin: () => number;
    getSideSpin: () => number;
    getBackSpin: () => number;
    getTargetDistance: () => Unit;
    toJson: () => any;
}

export class ShotData implements IShotData {
    protected _id: number;
    protected _club: string;
    protected _clubHeadSpeed: Unit;
    protected _carry: Unit;
    protected _totalDistance: Unit;
    protected _offline: Unit;
    protected _totalSpin: number;
    protected _sideSpin: number;
    protected _backSpin: number;
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
        this._id = id;
        this._club = club;
        this._clubHeadSpeed = clubHeadSpeed;
        this._carry = carry;
        this._totalDistance = totalDistance;
        this._offline = offline;
        this._totalSpin = totalSpin;
        this._sideSpin = sideSpin;
        this._backSpin = backSpin;
        this._targetDistance = targetDistance;
    }

    public getId = (): number => {
        return this._id;
    }

    public getClub = (): string => {
        return this._club;
    }

    public getClubHeadSpeed = (): Unit => {
        return this._clubHeadSpeed;
    }

    public getCarry = (): Unit => {
        return this._carry;
    }

    public getTotalDistance = (): Unit => {
        return this._totalDistance;
    }

    public getOffline = (): Unit => {
        return this._offline;
    }

    public getTotalSpin = (): number => {
        return this._totalSpin;
    }

    public getSideSpin = (): number => {
        return this._sideSpin;
    }

    public getBackSpin = (): number => {
        return this._backSpin;
    }

    public getTargetDistance = (): Unit => {
        return this._targetDistance;
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
