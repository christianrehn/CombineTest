import * as math from "mathjs";
import {Unit} from "mathjs";
import {assert} from "chai";
import {ShotData} from "./ShotData";

export interface IShotDataX {
    getId: () => number;
    getClub: () => string;
    getClubHeadSpeed: () => Unit;
    getCarry: () => Unit;
    getTotalDistance: () => Unit;
    getOffline: () => Unit;
    getTotalSpin: () => number;
    getSideSpin: () => number;
    getBackSpin: () => number;
    toShotData: (targetDistance: Unit) => ShotData;
}

export class ShotDataX implements IShotDataX {
    protected _id: number;
    protected _club: string;
    protected _clubHeadSpeed: Unit;
    protected _carry: Unit;
    protected _totalDistance: Unit;
    protected _offline: Unit;
    protected _totalSpin: number;
    protected _sideSpin: number;
    protected _backSpin: number;

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

    public static fromSessionShotDataJson = (sessionShotDataAsJson: any): ShotDataX => {
        assert(sessionShotDataAsJson.hasOwnProperty("BallData"), "!sessionShotDataAsJson.hasOwnProperty(BallData)");
        assert(sessionShotDataAsJson.hasOwnProperty("FlightData"), "!sessionShotDataAsJson.hasOwnProperty(FlightData)");
        // hint: property ClubData is optional

        const shotDataX: ShotDataX = new ShotDataX(
            sessionShotDataAsJson["ID"] ?? -1,
            sessionShotDataAsJson["ClubName"] ?? "",
            math.unit(sessionShotDataAsJson.hasOwnProperty("ClubData")
                    ? sessionShotDataAsJson["ClubData"]["ClubSpeed_MS"] ?? 0
                    : 0
                , "m"),
            math.unit(sessionShotDataAsJson["FlightData"]["CarryDistance_M"] ?? 0, "m"),
            math.unit(sessionShotDataAsJson["FlightData"]["TotalDistance_M"] ?? 0, "m"),
            math.unit(sessionShotDataAsJson["FlightData"]["OfflineDistance_M"] ?? 0, "m"),
            sessionShotDataAsJson["BallData"]["TotalSpin_RPM"] ?? 0,
            sessionShotDataAsJson["BallData"]["SideSpin_RPM"] ?? 0,
            sessionShotDataAsJson["BallData"]["BackSpin_RPM"] ?? 0,
        );
        return shotDataX;
    }


    public toShotData = (targetDistance: Unit): ShotData => {
        return new ShotData(
            this.getId(),
            this.getClub(),
            this.getClubHeadSpeed(),
            this.getCarry(),
            this.getTotalDistance(),
            this.getOffline(),
            this.getTotalSpin(),
            this.getSideSpin(),
            this.getBackSpin(),
            targetDistance
        )
    }
}
