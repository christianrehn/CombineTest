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
    assert(!drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusInUnit() > 0, "!(!drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusInUnit() > 0)");
    assert(drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusInPercent() > 0, "!(drillConfiguration.getTargetCircleRadiusAsUnitNotPercent() || drillConfiguration.getTargetCircleRadiusInPercent() > 0)");
    assert(!!targetDistance, "!targetDistance");

    const targetDistanceInUnitAsNumber: number = targetDistance.toNumber(drillConfiguration.getUnit());
    const fromPinInUnitAsNumber: number = fromPin.toNumber(drillConfiguration.getUnit());

    const maxFromPinInUnitAsNumber: number =
        drillConfiguration.getTargetCircleRadiusAsUnitNotPercent()
            ? drillConfiguration.getTargetCircleRadiusInUnit()
            : drillConfiguration.getTargetCircleRadiusInPercent() * targetDistanceInUnitAsNumber / 100;
    console.log("maxFromPinInUnitAsNumber", maxFromPinInUnitAsNumber)

    if (fromPinInUnitAsNumber > maxFromPinInUnitAsNumber) {
        // outside target circle -> 0 score
        console.log(`From Pin ${fromPinInUnitAsNumber} > Max. From Pin ${maxFromPinInUnitAsNumber} -> outside target circle -> 0 score`);
        return 0
    }

    // inside target circle => calculate linear score
    console.log(`From Pin ${fromPinInUnitAsNumber} <= Max. From Pin ${maxFromPinInUnitAsNumber} -> inside target circle -> calculate score`);
    return Math.round((maxFromPinInUnitAsNumber + (maxFromPinInUnitAsNumber - fromPinInUnitAsNumber)) * 1000 / maxFromPinInUnitAsNumber) / 10;
}
