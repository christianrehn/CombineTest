import {Unit} from "mathjs";
import {assert} from "chai";
import {IDrillConfiguration} from "./DrillConfiguration/DrillConfiguration";
import {spinDrillType} from "./SelectValues/DrillType";

export type SpinScoreType = { spinScore: number, spinRateScore: number, coastingPenaltyScore: number };

export const computeSpinScore = (drillConfiguration: IDrillConfiguration, targetDistance: Unit, totalSpinInRpm: number, carry: Unit, totalDistance: Unit): SpinScoreType => {
    assert(!!drillConfiguration, "!drillConfiguration");
    if (![spinDrillType].includes(drillConfiguration.getDrillType())) {
        // score can only be computes for drill configuration type spin
        return {spinScore: 0, spinRateScore: 0, coastingPenaltyScore: 0};
    }
    assert(drillConfiguration.getTargetSpinInRpmPerUnit() > 0, "!(drillConfiguration.getTargetSpinInRpmPerUnit() > 0)");
    assert(!drillConfiguration.getMaxDeviationAsUnitNotPercent() || drillConfiguration.getMaxDeviationInUnit() > 0, "!(!drillConfiguration.getMaxDeviationAsUnitNotPercent() || drillConfiguration.getMaxDeviationInUnit() > 0)");
    assert(drillConfiguration.getMaxDeviationAsUnitNotPercent() || drillConfiguration.getMaxDeviationInPercent() > 0, "!(drillConfiguration.getMaxDeviationAsUnitNotPercent() || drillConfiguration.getMaxDeviationInPercent() > 0)");
    assert(!!targetDistance, "!targetDistance");
    assert(totalSpinInRpm >= 0, "!(totalSpinInRpm >= 0)");
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
        return {spinScore: 0, spinRateScore: 0, coastingPenaltyScore: 0};
    }

    // inside corridor => calculate linear score for total spin
    console.log(`Deviation ${currentDeviationInUnitAsNumber} <= Max. Deviation ${maxDeviationInUnitAsNumber} -> inside corridor -> calculate score depending on total spin`);
    const targetSpinInRpm: number = drillConfiguration.getTargetSpinInRpmPerUnit() * carryInUnitAsNumber; // do not use target distance but the carry of the shot
    console.log(`totalSpinInRpm=${totalSpinInRpm} / targetSpinInRpm=${targetSpinInRpm} = ${totalSpinInRpm / targetSpinInRpm}`)
    const spinRateScore: number = Math.round(totalSpinInRpm * 1000 / targetSpinInRpm) / 10;

    // calculate negative score for coasting
    let coastingPenaltyScore: number = 0;
    if (drillConfiguration.getConsiderCoastingBehavior()) {
        const totalDistanceInUnitAsNumber: number = totalDistance.toNumber(drillConfiguration.getUnit());
        const coastingDistanceInUnitAsNumber: number = totalDistanceInUnitAsNumber - carryInUnitAsNumber;
        if (coastingDistanceInUnitAsNumber > drillConfiguration.getMaxCoastingInUnit()) {
            const tooMuchCoastingInUnitAsNumber: number = coastingDistanceInUnitAsNumber - drillConfiguration.getMaxCoastingInUnit();
            coastingPenaltyScore = Math.round(tooMuchCoastingInUnitAsNumber / drillConfiguration.getMinus1ScorePerCoastingInUnit());
            console.log(`tooMuchCoastingInUnitAsNumber=${tooMuchCoastingInUnitAsNumber} / minus1ScorePerCoastingInUnit=${drillConfiguration.getMinus1ScorePerCoastingInUnit()} = ${coastingPenaltyScore}`)
        }
    }

    return {spinScore: Math.max(spinRateScore - coastingPenaltyScore, 0), spinRateScore, coastingPenaltyScore};
}
