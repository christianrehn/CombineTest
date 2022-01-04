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
distanceToSlopeYInterceptMap.set(29, {m: 0.103, t: 0.51});
distanceToSlopeYInterceptMap.set(35, {m: 0.108, t: 0.58});
distanceToSlopeYInterceptMap.set(38, {m: 0.116, t: 0.50});
distanceToSlopeYInterceptMap.set(50, {m: 0.125, t: 0.63});
distanceToSlopeYInterceptMap.set(55, {m: 0.132, t: 0.66});
distanceToSlopeYInterceptMap.set(58, {m: 0.140, t: 0.70});
distanceToSlopeYInterceptMap.set(65, {m: 0.156, t: 0.73});
distanceToSlopeYInterceptMap.set(68, {m: 0.166, t: 0.85});
distanceToSlopeYInterceptMap.set(75, {m: 0.182, t: 0.85});
distanceToSlopeYInterceptMap.set(85, {m: 0.206, t: 0.98});
distanceToSlopeYInterceptMap.set(95, {m: 0.235, t: 0.99});
distanceToSlopeYInterceptMap.set(105, {m: 0.255, t: 1.22});
distanceToSlopeYInterceptMap.set(125, {m: 0.300, t: 1.52});
distanceToSlopeYInterceptMap.set(145, {m: 0.346, t: 1.75});
distanceToSlopeYInterceptMap.set(165, {m: 0.400, t: 1.95});

const distanceToSlopeYInterceptAscMap: Map<number, SlopeYInterceptType> =
    new Map([...distanceToSlopeYInterceptMap.entries()]
        .sort((a, b) => a[0] - b[0])
    );

export const computeTrackmanScore = (targetDistance: Unit, fromPin: Unit): number => {
    assert(!!targetDistance, "!targetDistance");
    assert(!!fromPin, "!fromPin");

    // convert all input values to meters because the interpolation of trackman scores is in meters
    const targetDistanceMeter = targetDistance.toNumber(meter);
    const fromPinMeter = fromPin.toNumber(meter);

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
    console.log("computeTrackmanScore - nextSmallerDistance=", nextSmallerDistance);
    console.log("computeTrackmanScore - nextLargerDistance=", nextLargerDistance);
    console.log("computeTrackmanScore - exactMatch=", exactMatch);

    if (exactMatch) {
        assert(!!nextSmallerDistance, "!nextSmallerDistance");
        assert(!!nextLargerDistance, "!nextLargerDistance");
        assert(nextSmallerDistance === nextLargerDistance, "nextSmallerDistance != nextLargerDistance");
        const slopeYIntercept: SlopeYInterceptType = distanceToSlopeYInterceptAscMap.get(nextSmallerDistance);
        // x = (y-t) / m
        const trackmanPenaltyScore: number = Math.round((fromPinMeter - slopeYIntercept.t) / slopeYIntercept.m);
        // valid score range is [0,100]
        if (trackmanPenaltyScore > 100) {
            return 0;
        }
        if (trackmanPenaltyScore < 0) {
            return 100;
        }
        return 100 - trackmanPenaltyScore;
    }
    return 48;
}
