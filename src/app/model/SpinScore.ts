import {Unit} from "mathjs";
import {assert} from "chai";
import {IDrillConfiguration} from "./DrillConfiguration/DrillConfiguration";
import {spinDrillType} from "./SelectValues/DrillType";


export const computeSpinScore = (drillConfiguration: IDrillConfiguration, targetDistance: Unit, totalSpinInRpm: number, carry: Unit): number => {
    assert(!!drillConfiguration, "!drillConfiguration");
    if (drillConfiguration.getDrillType() !== spinDrillType) {
        // score can only be computes for drill configuration type spin
        return 0;
    }
    assert(drillConfiguration.getTargetSpinInRpmPerUnit() > 0, "!(drillConfiguration.getTargetSpinInRpmPerUnit() > 0)");
    assert(!drillConfiguration.getMaxDeviationAsUnitNotPercent() || drillConfiguration.getMaxDeviationInUnit() > 0, "!(!drillConfiguration.getMaxDeviationAsUnitNotPercent() || drillConfiguration.getMaxDeviationInUnit() > 0)");
    assert(drillConfiguration.getMaxDeviationAsUnitNotPercent() || drillConfiguration.getMaxDeviationInPercent() > 0, "!(drillConfiguration.getMaxDeviationAsUnitNotPercent() || drillConfiguration.getMaxDeviationInPercent() > 0)");
    assert(!!targetDistance, "!targetDistance");
    assert(totalSpinInRpm >= 0, "!(totalSpin >= 0)");
    assert(!!carry, "!carry");

    const targetDistanceInUnitAsNumber: number = targetDistance.toNumber(drillConfiguration.getUnit());
    const carryInUnitAsNumber: number = carry.toNumber(drillConfiguration.getUnit());
    const currentDeviationInUnitAsNumber: number = Math.abs(targetDistanceInUnitAsNumber - carryInUnitAsNumber)
    console.log("currentDeviationInUnitAsNumber", currentDeviationInUnitAsNumber);

    const maxDeviationInUnitAsNumber: number =
        drillConfiguration.getMaxDeviationAsUnitNotPercent()
            ? drillConfiguration.getMaxDeviationInUnit()
            : drillConfiguration.getMaxDeviationInPercent() * targetDistanceInUnitAsNumber / 100;
    console.log("maxDeviationInUnitAsNumber", maxDeviationInUnitAsNumber)

    if (currentDeviationInUnitAsNumber > maxDeviationInUnitAsNumber) {
        // outside corridor -> 0 score
        console.log(`Deviation ${currentDeviationInUnitAsNumber} > Max. Deviation ${maxDeviationInUnitAsNumber} -> outside corridor -> 0 score`);
        return 0
    }

    // inside corridor => calculate linear score for total spin
    console.log(`Deviation ${currentDeviationInUnitAsNumber} <= Max. Deviation ${maxDeviationInUnitAsNumber} -> inside corridor -> calculate score depending on total spin`);
    const targetSpinInRpm: number = drillConfiguration.getTargetSpinInRpmPerUnit() * carryInUnitAsNumber; // do not use target distance but the carry of the shot
    console.log(`totalSpinInRpm=${totalSpinInRpm} / targetSpinInRpm=${targetSpinInRpm} = ${totalSpinInRpm / targetSpinInRpm}`)
    return Math.round(totalSpinInRpm * 1000 / targetSpinInRpm) / 10;
}
