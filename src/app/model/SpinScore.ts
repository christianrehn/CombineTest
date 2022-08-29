import {Unit} from "mathjs";
import {assert} from "chai";
import {IDrillConfiguration} from "./DrillConfiguration/DrillConfiguration";
import {spinDrillType} from "./SelectValues/DrillType";


export const computeSpinScore = (drillConfiguration: IDrillConfiguration, targetDistance: Unit, totalSpin: number, carry: Unit): number => {
    assert(!!drillConfiguration, "!drillConfiguration");
    if (drillConfiguration.getDrillType() !== spinDrillType) {
        // score can only be computes for drill configuration type spin
        return 0;
    }
    assert(drillConfiguration.getTargetRpmPerUnit() > 0, "!(drillConfiguration.getTargetRpmPerUnit() > 0)");
    assert(drillConfiguration.getDeviationInUnit() > 0, "!(drillConfiguration.getDeviationInUnit() > 0)");
    assert(!!targetDistance, "!targetDistance");
    assert(totalSpin >= 0, "!(totalSpin >= 0)");
    assert(!!carry, "!carry");

    const currentDeviation: number = Math.abs(targetDistance.toNumber(drillConfiguration.getUnit()) - carry.toNumber(drillConfiguration.getUnit()))
    console.log("currentDeviation", currentDeviation)
    if (currentDeviation > drillConfiguration.getDeviationInUnit()) {
        // outside corridor => 0 score
        return 0
    }

    // inside corridor => calculate score for total spin
    const setpointSpinInRpm: number = drillConfiguration.getTargetRpmPerUnit() * targetDistance.toNumber(targetDistance.formatUnits());
    if (totalSpin >= setpointSpinInRpm) {
        // maximum score is 100
        return 100;
    }


    return Math.round(totalSpin * 1000 / setpointSpinInRpm) / 10;
}
