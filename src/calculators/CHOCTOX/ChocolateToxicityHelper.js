import { ChocolateMethylxanthineMgG, ChocolateTypes } from "./ChocolateTypes";
import { ChocQuantityUnits } from "./ChocQuantityUnits";

const ChocolateToxicityHelper = {

    calculateChocolateToxicity(weightKg, chocolateType, quantity, quantityUnit, cocoaPercent = null){
        if(weightKg <= 0 || quantity <= 0)
            return null;

        const methylxanthineMgG = this.getMethylxanthineMgG(chocolateType, cocoaPercent);

        if(methylxanthineMgG == null)
            return {
                error: 'Methylxanthine concentration unavailable for this product.'
            };

        const quantityGrams = this.chocolateQuantityToGrams(quantity, quantityUnit);
        if(quantityGrams == null)
            return {
                error: 'Unable to convert quantity to grams.'
            };

        const totalMethylxanthineMg = quantityGrams * methylxanthineMgG;

        const methylxanthineMgKg = totalMethylxanthineMg / weightKg;

        return {
            chocolateType,
            quantityGrams,
            methylxanthineMgG,
            totalMethylxanthineMg,
            methylxanthineMgKg,
            toxicity: this.getChocolateToxicityLevel(methylxanthineMgKg)
        };
    },

    getChocolateToxicityLevel(mgKg){
        if(mgKg < 20)
            return {
                level: 'LOW',
                label: 'Below reported mild-sign threshold'
            };

        if(mgKg < 40)
            return {
                level: 'MILD',
                label: 'Mild clinical signs possible'
            };

        if(mgKg < 60)
            return {
                level: 'CARDIAC',
                label: 'Cardiotoxic effects possible'
            };

        return {
            level: 'SEVERE',
            label: 'Severe toxicity / seizure risk'
        };
    },

    getMethylxanthineMgG(chocolateType, cocoaPercent = null){
        if(chocolateType === ChocolateTypes.COCOAOTHER){
            if(cocoaPercent == null || cocoaPercent <= 0 || cocoaPercent > 100)
                return null;

            return 15.5 * (cocoaPercent / 100);
        }

        return ChocolateMethylxanthineMgG[chocolateType] ?? null;
    },

    chocolateQuantityToGrams(quantity, unit){
        if(quantity <= 0)
            return null;

        switch(unit){
            case ChocQuantityUnits.GM:
                return quantity;
            case ChocQuantityUnits.OZ:
                return quantity * 28.3495;
            default:
                return null;
        }
    }

};

export default ChocolateToxicityHelper;