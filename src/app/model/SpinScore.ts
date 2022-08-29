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
    assert(drillConfiguration.getMaxDeviationInPercent() > 0, "!(drillConfiguration.getMaxDeviationInPercent() > 0)");
    assert(!!targetDistance, "!targetDistance");
    assert(totalSpinInRpm >= 0, "!(totalSpin >= 0)");
    assert(!!carry, "!carry");

    const targetDistanceAsNumber = targetDistance.toNumber(drillConfiguration.getUnit());
    const currentDeviationInUnitAsNumber: number = Math.abs(targetDistanceAsNumber - carry.toNumber(drillConfiguration.getUnit()))
    console.log("currentDeviationInUnitAsNumber", currentDeviationInUnitAsNumber);
    const maxDeviationInUnitAsNumber: number = drillConfiguration.getMaxDeviationInPercent() * targetDistanceAsNumber / 100;
    console.log("maxDeviationInUnitAsNumber", maxDeviationInUnitAsNumber)
    if (currentDeviationInUnitAsNumber > maxDeviationInUnitAsNumber) {
        // outside corridor -> 0 score
        console.log(`Deviation ${currentDeviationInUnitAsNumber} > Max. Deviation ${maxDeviationInUnitAsNumber} -> outside corridor -> 0 score`);
        return 0
    }

    // inside corridor => calculate score for total spin
    console.log(`Deviation ${currentDeviationInUnitAsNumber} <= Max. Deviation ${maxDeviationInUnitAsNumber} -> inside corridor -> calculate score depending on total spin`);
    const targetDistanceInUnitAsNumber: number = targetDistance.toNumber(targetDistance.formatUnits());
    const targetSpinInRpm: number = drillConfiguration.getTargetSpinInRpmPerUnit() * targetDistanceInUnitAsNumber;
    console.log("targetSpinInRpm", targetSpinInRpm)
    if (totalSpinInRpm >= targetSpinInRpm) {
        // maximum score is 100
        console.log(`totalSpinInRpm=${totalSpinInRpm} > targetSpinInRpm=${targetSpinInRpm} -> 100 score`)
        return 100;
    }

    // linear score between setpointSpinInRpm and zero spin
    console.log(`totalSpinInRpm=${totalSpinInRpm} / targetSpinInRpm=${targetSpinInRpm} = ${totalSpinInRpm / targetSpinInRpm}`)
    return Math.round(totalSpinInRpm * 1000 / targetSpinInRpm) / 10;
}
