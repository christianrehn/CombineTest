import {Unit} from "mathjs";
import {assert} from "chai";
import {IDrillConfiguration} from "./DrillConfiguration/DrillConfiguration";
import {targetCircleDrillType} from "./SelectValues/DrillType";


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

    const maxFromPinInUnitAsNumber: number =
        drillConfiguration.getTargetCircleRadiusAsUnitNotPercent()
            ? drillConfiguration.getTargetCircleRadiusScore100InUnit()
            : drillConfiguration.getTargetCircleRadiusScore100InPercent() * targetDistanceInUnitAsNumber / 100;
    console.log("maxFromPinInUnitAsNumber", maxFromPinInUnitAsNumber)

    return Math.max(Math.round((maxFromPinInUnitAsNumber + (maxFromPinInUnitAsNumber - fromPinInUnitAsNumber)) * 1000 / maxFromPinInUnitAsNumber) / 10, 0);
}
