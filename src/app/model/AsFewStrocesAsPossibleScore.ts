import {Unit} from "mathjs";
import {assert} from "chai";
import {IDrillConfiguration} from "./DrillConfiguration/DrillConfiguration";
import {asFewStrokesAsPossibleDrillType} from "./SelectValues/DrillType";

/**
 * Returns null if drillType is wrong, true if inside target circle, else false.
 */
export const computeAsFewStrokesAsPossibleScore = (drillConfiguration: IDrillConfiguration, targetDistance: Unit, fromPin: Unit): boolean => {
    assert(!!drillConfiguration, "!drillConfiguration");
    assert(!!targetDistance, "!targetDistance");
    assert(!!fromPin, "!fromPin");

    if (![asFewStrokesAsPossibleDrillType].includes(drillConfiguration.getDrillType())) {
        // score can only be computes for drill configuration type spin
        return null;
    }
    assert(!drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusScore100InUnit() > 0, "!(!drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusScore100InUnit() > 0)");
    assert(drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusScore100InPercent() > 0, "!(drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusScore100InPercent() > 0)");
    assert(!!targetDistance, "!targetDistance");

    const targetDistanceInUnitAsNumber: number = targetDistance.toNumber(drillConfiguration.getUnit());
    const fromPinInUnitAsNumber: number = fromPin.toNumber(drillConfiguration.getUnit());
    console.log("fromPinInUnitAsNumber", fromPinInUnitAsNumber);

    const targetCircleRadiusInUnitAsNumber: number =
        drillConfiguration.getTargetCircleRadiusAsUnitNotPercent()
            ? drillConfiguration.getTargetCircleRadiusScore100InUnit()
            : drillConfiguration.getTargetCircleRadiusScore100InPercent() * targetDistanceInUnitAsNumber / 100;
    console.log("targetCircleRadiusInUnitAsNumber", targetCircleRadiusInUnitAsNumber);

    // fromPinDeltaInUnitAsNumber is negative inside inner circle
    const fromPinDeltaInUnitAsNumber: number = fromPinInUnitAsNumber - targetCircleRadiusInUnitAsNumber;
    console.log("fromPinDeltaInUnitAsNumber", fromPinDeltaInUnitAsNumber);

    return fromPinDeltaInUnitAsNumber <= 0;
}
