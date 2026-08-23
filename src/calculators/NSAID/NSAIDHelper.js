import { NSAIDAmountType } from "./NSAIDAmountType";
import { NSAIDDrugs } from "./NSAIDDrugs";
import { NSAIDToxicityType } from "./NSAIDToxicityType";

const NSAIDHelper = {

    calculateNSAIDToxicity(drug, species, weightKg, totalMg){
        console.log(drug, species, weightKg, totalMg);

        const doseMgKg = totalMg / weightKg;
        const thresholds = NSAIDDrugs[drug]?.[species];

        if(!thresholds || (!thresholds.gi && !thresholds.CNS && !thresholds.RENAL))
            return null;

        const effects = [];

        if(thresholds.gi !== null && doseMgKg >= thresholds.gi)
            effects.push(NSAIDToxicityType.GI);

        if(thresholds.renal !== null && doseMgKg >= thresholds.renal)
            effects.push(NSAIDToxicityType.RENAL);

        if(thresholds.cns !== null && doseMgKg >= thresholds.cns)
            effects.push(NSAIDToxicityType.CNS);

        return {
            totalMg,
            doseMgKg,
            effects
        };
    },

    calculateTotalMg(amountMg, numPills, quantityType){
        if(quantityType === NSAIDAmountType.PERPILL)
            return amountMg * numPills;

        return amountMg;
    }

};

export default NSAIDHelper;