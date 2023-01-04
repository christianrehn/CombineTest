import {Unit} from "mathjs";
import {assert} from "chai";
import {IDrillConfiguration} from "../model/DrillConfiguration/DrillConfiguration";
import {targetCircleDrillType} from "../model/SelectValues/DrillType";

/**
 * If fromPin equals the radius of the inner circle score is 100.
 * Score is linear decreased to zero to the radius of the outer circle.
 * Score is linear increased by the same amount up to the targetDistance.
 */
export const computeTargetCircleScore = (drillConfiguration: IDrillConfiguration, targetDistance: Unit, fromPin: Unit): number => {
    assert(!!drillConfiguration, "!drillConfiguration");
    assert(!!targetDistance, "!targetDistance");
    assert(!!fromPin, "!fromPin");

    if (![targetCircleDrillType].includes(drillConfiguration.getDrillType())) {
        // score can only be computes for drill configuration type spin
        return 0;
    }
    assert(!drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusScore100InUnit() > 0, "!(!drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusScore100InUnit() > 0)");
    assert(!drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusScore0InUnit() > 0, "!(!drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusScore0InUnit() > 0)");
    assert(drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusScore100InPercent() > 0, "!(drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusScore100InPercent() > 0)");
    assert(drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusScore0InPercent() > 0, "!(drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusScore0InPercent() > 0)");
    assert(!!targetDistance, "!targetDistance");

    const targetDistanceInUnitAsNumber: number = targetDistance.toNumber(drillConfiguration.getUnit());
    const fromPinInUnitAsNumber: number = fromPin.toNumber(drillConfiguration.getUnit());

    const targetCircleRadiusScore100InUnitAsNumber: number =
        drillConfiguration.getTargetCircleRadiusAsUnitNotPercent()
            ? drillConfiguration.getTargetCircleRadiusScore100InUnit()
            : drillConfiguration.getTargetCircleRadiusScore100InPercent() * targetDistanceInUnitAsNumber / 100;
    console.log("targetCircleRadiusScore100InUnitAsNumber", targetCircleRadiusScore100InUnitAsNumber);
    const targetCircleRadiusScore0InUnitAsNumber: number =
        drillConfiguration.getTargetCircleRadiusAsUnitNotPercent()
            ? drillConfiguration.getTargetCircleRadiusScore0InUnit()
            : drillConfiguration.getTargetCircleRadiusScore0InPercent() * targetDistanceInUnitAsNumber / 100;
    console.log("targetCircleRadiusScore0InUnitAsNumber", targetCircleRadiusScore0InUnitAsNumber);

    const targetCircleRadiusDeltaInUnitAsNumber: number = targetCircleRadiusScore0InUnitAsNumber - targetCircleRadiusScore100InUnitAsNumber;
    console.log("targetCircleRadiusDeltaInUnitAsNumber", targetCircleRadiusDeltaInUnitAsNumber);

    // fromPinDeltaInUnitAsNumber is negative inside inner circle
    const fromPinDeltaInUnitAsNumber: number = fromPinInUnitAsNumber - targetCircleRadiusScore100InUnitAsNumber;
    console.log("fromPinDeltaInUnitAsNumber", fromPinDeltaInUnitAsNumber);

    // (delta_circle - delta_fromPin) * 100 / delta_circle
    return Math.max(Math.round((targetCircleRadiusDeltaInUnitAsNumber - fromPinDeltaInUnitAsNumber) * 1000 / targetCircleRadiusDeltaInUnitAsNumber) / 10, 0);
}
