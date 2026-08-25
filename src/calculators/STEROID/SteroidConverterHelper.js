import { SteroidDrugs } from "./SteroidDrugs";

const SteroidConverterHelper = {

    calculateSteroidConversionGluc(steroidFrom, steroidTo, amount){
        const originalSteroid = SteroidDrugs[steroidFrom];
        const newSteroid = SteroidDrugs[steroidTo];
        const originalAmountMg = Number(amount);

        if(!originalSteroid || !newSteroid)
            return null;

        if(!Number.isFinite(originalAmountMg) || originalAmountMg <= 0)
            return null

        return {
            originalSteroid: {
                name: steroidFrom,
                amountMg: originalAmountMg,
                relativePotency: originalSteroid.glucocorticoidPotency,
                duration: originalSteroid.duration
            },
            newSteroid: {
                name: steroidTo,
                equivalentDoseMg: this.calculateEquivalentDose(
                    originalAmountMg,
                    originalSteroid.glucocorticoidPotency,
                    newSteroid.glucocorticoidPotency
                ),
                relativePotency: newSteroid.glucocorticoidPotency,
                duration: newSteroid.duration
            }
        }
    },

    calculateSteroidConversionMine(steroidFrom, steroidTo, amount){
        const originalSteroid = SteroidDrugs[steroidFrom];
        const newSteroid = SteroidDrugs[steroidTo];
        const originalAmountMg = Number(amount);

        if(!originalSteroid || !newSteroid)
            return null;

        if(!Number.isFinite(originalAmountMg) || originalAmountMg <= 0)
            return null

        return {
            originalSteroid: {
                name: steroidFrom,
                amountMg: originalAmountMg,
                relativePotency: originalSteroid.mineralocorticoidPotency
            },
            newSteroid: {
                name: steroidTo,
                equivalentDoseMg: this.calculateMineralocorticoidEquivalentDose(
                    originalAmountMg,
                    originalSteroid.mineralocorticoidPotency,
                    newSteroid.mineralocorticoidPotency
                ),
                relativePotency: newSteroid.mineralocorticoidPotency
            }
        };
    },

    calculateEquivalentDose(amountMg, fromPotency, toPotency){
        return amountMg * (fromPotency / toPotency);
    },

    calculateMineralocorticoidEquivalentDose(amountMg, fromPotency, toPotency){
        if(toPotency === 0)
            return null;

        return amountMg * (fromPotency / toPotency);
    }
};

export default SteroidConverterHelper;