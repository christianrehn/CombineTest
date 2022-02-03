import {Unit} from "mathjs";
import {assert} from "chai";
import {meter} from "./Unit/Unit";

// slope m and y-intercept t of a linear functions f(x) = m*x + t
// where f(x) is fromPin in meter and x is 100 - trackman score
// trackman penalty score := 100 - trackman score
type SlopeYInterceptType = {
    m: number,
    t: number,
}

// map of linear functions f_d(x) = m*x + t for fixed target distances d in meter.
const distanceToSlopeYInterceptMap: Map<number, SlopeYInterceptType> = new Map<number, SlopeYInterceptType>();
distanceToSlopeYInterceptMap.set(13, {m: 0.0619968526629126, t: 0.287931858256072});
distanceToSlopeYInterceptMap.set(25, {m: 0.0944788660668817, t: 0.500758360210491});
distanceToSlopeYInterceptMap.set(29, {m: 0.103981106612686, t: 0.496302294197031});
distanceToSlopeYInterceptMap.set(35, {m: 0.110847203889121, t: 0.55299893757445});
distanceToSlopeYInterceptMap.set(38, {m: 0.115756097560976, t: 0.497414634146342});
distanceToSlopeYInterceptMap.set(43, {m: 0.118524395188642, t: 0.606739334726558});
distanceToSlopeYInterceptMap.set(48, {m: 0.117781043350478, t: 0.685892725936812});
distanceToSlopeYInterceptMap.set(50, {m: 0.124439577428498, t: 0.642746714764235});
distanceToSlopeYInterceptMap.set(52, {m: 0.125615444923559, t: 0.697279498235985});
distanceToSlopeYInterceptMap.set(55, {m: 0.131769420047162, t: 0.669503434605789});
distanceToSlopeYInterceptMap.set(58, {m: 0.138921258177733, t: 0.711125805691636});
distanceToSlopeYInterceptMap.set(65, {m: 0.155716022045074, t: 0.773187383131583});
distanceToSlopeYInterceptMap.set(68, {m: 0.16422708618331, t: 0.850683994528045});
distanceToSlopeYInterceptMap.set(75, {m: 0.177998586128348, t: 0.895522739769068});
distanceToSlopeYInterceptMap.set(85, {m: 0.205057208237986, t: 0.998443935926772});
distanceToSlopeYInterceptMap.set(95, {m: 0.230882352941177, t: 1.08676470588235});
distanceToSlopeYInterceptMap.set(105, {m: 0.256567685589519, t: 1.23177292576419});
distanceToSlopeYInterceptMap.set(125, {m: 0.296081680654301, t: 1.57135296947667});
distanceToSlopeYInterceptMap.set(145, {m: 0.345151665837892, t: 1.75997016409746});
distanceToSlopeYInterceptMap.set(165, {m: 0.394541543425652, t: 1.96611992471094});

const distanceToSlopeYInterceptAscMap: Map<number, SlopeYInterceptType> =
    new Map([...distanceToSlopeYInterceptMap.entries()]
        .sort((a, b) => a[0] - b[0])
    );
const distanceToSlopeYInterceptAscArray: [number, SlopeYInterceptType][] = Array.from(distanceToSlopeYInterceptAscMap.entries());

const interAndExtraPolation = (x1: number, y1: number, x2: number, y2: number, x: number): number => {
    return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
}

const computeTrackmanScoreUsingYFromPinAndSlopeYIntercept = (yFromPinMeter: number, slopeYIntercept: SlopeYInterceptType): number => {
    // x = (y-t) / m
    const trackmanPenaltyScore: number = Math.round((yFromPinMeter - slopeYIntercept.t) / slopeYIntercept.m);
    // valid score range is [0,100]
    if (trackmanPenaltyScore > 100) {
        return 0;
    }
    if (trackmanPenaltyScore < 0) {
        return 100;
    }
    return 100 - trackmanPenaltyScore;
}

export const computeTrackmanScore = (targetDistance: Unit, fromPin: Unit): number => {
    assert(!!targetDistance, "!targetDistance");
    assert(!!fromPin, "!fromPin");

    // convert all input values to meters because the interpolation of trackman scores is in meters
    const targetDistanceMeter = targetDistance.toNumber(meter);
    console.log("computeTrackmanScore - targetDistanceMeter=", targetDistanceMeter);
    const fromPinMeter = fromPin.toNumber(meter);
    console.log("computeTrackmanScore - fromPinMeter=", fromPinMeter);

    // get best matching values for m and t from map
    let nextSmallerDistance: number = Number.MAX_VALUE;
    let nextLargerDistance: number = Number.MIN_VALUE;
    let exactMatch: boolean = false;
    for (let [distanceMeter, value] of distanceToSlopeYInterceptAscMap) {
        if (distanceMeter <= targetDistanceMeter) {
            nextSmallerDistance = distanceMeter;
        }
        if (distanceMeter >= targetDistanceMeter) {
            nextLargerDistance = distanceMeter;
            if (distanceMeter === targetDistanceMeter) {
                exactMatch = true;
            }
            break;
        }
    }
    console.log("computeTrackmanScore - exactMatch=", exactMatch);

    if (exactMatch) {
        assert(!!nextSmallerDistance, "!nextSmallerDistance");
        assert(!!nextLargerDistance, "!nextLargerDistance");
        assert(nextSmallerDistance === nextLargerDistance, "nextSmallerDistance != nextLargerDistance");
        const slopeYIntercept: SlopeYInterceptType = distanceToSlopeYInterceptAscMap.get(nextSmallerDistance);

        return computeTrackmanScoreUsingYFromPinAndSlopeYIntercept(fromPinMeter, slopeYIntercept);
    }

    // we have values on both sides for interpolation or 2 values on one side for extrapolation
    const slopeYInterceptNextSmallerDistance: SlopeYInterceptType =
        nextSmallerDistance === Number.MAX_VALUE // no smaller distance found -> use smallest available distance -> extrapolation
            ? distanceToSlopeYInterceptAscArray[0][1]
            : nextLargerDistance === Number.MIN_VALUE // no larger distance found -> use 2nd largest available distance -> extrapolation
                ? distanceToSlopeYInterceptAscArray[distanceToSlopeYInterceptAscArray.length - 2][1]
                : distanceToSlopeYInterceptAscMap.get(nextSmallerDistance);
    const slopeYInterceptNextLargerDistance: SlopeYInterceptType =
        nextSmallerDistance === Number.MAX_VALUE // no smaller distance found -> use 2nd smallest available distance -> extrapolation
            ? distanceToSlopeYInterceptAscArray[1][1]
            : nextLargerDistance === Number.MIN_VALUE // no larger distance found -> use  largest available distance -> extrapolation
                ? distanceToSlopeYInterceptAscArray[distanceToSlopeYInterceptAscArray.length - 1][1]
                : distanceToSlopeYInterceptAscMap.get(nextLargerDistance);
    if (nextSmallerDistance === Number.MAX_VALUE) {
        // no smaller distance found -> use smallest available distance -> extrapolation
        assert(nextLargerDistance === distanceToSlopeYInterceptAscArray[0][0], `nextLargerDistance (${nextLargerDistance}) != distanceToSlopeYInterceptAscArray[0][0]`);
        nextSmallerDistance = nextLargerDistance;
        nextLargerDistance = distanceToSlopeYInterceptAscArray[1][0];
    } else if (nextLargerDistance === Number.MIN_VALUE) {
        // no larger distance found -> use  largest available distance) -> extrapolation
        assert(nextSmallerDistance === distanceToSlopeYInterceptAscArray[distanceToSlopeYInterceptAscArray.length - 1][0], `nextSmallerDistance (${nextSmallerDistance}) != distanceToSlopeYInterceptAscArray[distanceToSlopeYInterceptAscArray.length - 1][0]`);
        nextLargerDistance = nextSmallerDistance;
        nextSmallerDistance = distanceToSlopeYInterceptAscArray[distanceToSlopeYInterceptAscArray.length - 2][0];
    }
    console.log("computeTrackmanScore - nextSmallerDistance=", nextSmallerDistance);
    console.log(`score for slopeYInterceptNextSmallerDistance (${nextSmallerDistance}): `, computeTrackmanScoreUsingYFromPinAndSlopeYIntercept(fromPinMeter, slopeYInterceptNextSmallerDistance));
    console.log("computeTrackmanScore - nextLargerDistance=", nextLargerDistance);
    console.log(`score for slopeYInterceptNextLargerDistance: (${nextLargerDistance})`, computeTrackmanScoreUsingYFromPinAndSlopeYIntercept(fromPinMeter, slopeYInterceptNextLargerDistance));

    // do inter-/ertrapolation for m and t
    const m: number = interAndExtraPolation(nextSmallerDistance, slopeYInterceptNextSmallerDistance.m, nextLargerDistance, slopeYInterceptNextLargerDistance.m, targetDistanceMeter)
    const t: number = interAndExtraPolation(nextSmallerDistance, slopeYInterceptNextSmallerDistance.t, nextLargerDistance, slopeYInterceptNextLargerDistance.t, targetDistanceMeter)

    // compute trackman score with inter-/extrapolated m and t
    return computeTrackmanScoreUsingYFromPinAndSlopeYIntercept(fromPinMeter, {m, t});
}
