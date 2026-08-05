import { KbrConcentrationOptions } from "./KBrConcentrationOptions";

const BromideHelper = {

    calculateDoseMg(weightKg, sharedData){
        const { totalLoad, daysLoad, numDoses } = sharedData;

        if( weightKg <= 0 ||
            totalLoad <= 0 ||
            daysLoad <= 0 ||
            numDoses <= 0
        )
            return null;

        const totalLoadMg = weightKg * totalLoad;
        const dailyDoseMg = totalLoadMg / daysLoad;
        const doseMg = dailyDoseMg / numDoses;

        return {
            totalLoadMg,
            dailyDoseMg,
            doseMg
        };
    },

    calculateKbrLiquid(weightKg, sharedData, kbrData){
        const dose = this.calculateDoseMg(weightKg, sharedData);

        if(!dose || kbrData.mgMl <= 0)
            return null;

        return {
            compound: 'KBr',
            dosageForm: 'liquid',
            ...dose,
            amount: dose.doseMg / kbrData.mgMl,
            amountUnit: 'mL',
            concentration: kbrData.mgMl,
            concentrationUnit: 'mg/mL',
            route: kbrData.takingRectally ? 'rectal' : 'oral'
        };
    },

    calculateKbrTablets(weightKg, sharedData, kbrData, tabletIncrement = 0.5){
        const dose = this.calculateDoseMg(weightKg, sharedData);

        if(!dose || kbrData.mgTablet <= 0 || tabletIncrement <= 0)
            return null;

        const exactTablets = dose.doseMg / kbrData.mgTablet;

        const roundedTablets = Math.round(exactTablets / tabletIncrement) * tabletIncrement;

        return {
            compound: 'KBr',
            dosageForm: 'tablet',
            ...dose,
            exactTablets,
            roundedTablets,
            amount: roundedTablets,
            amountUnit: 'tablets',
            tabletStrength: kbrData.mgTablet,
            tabletStrengthUnit: 'mg/tablet',
            tabletIncrement,
            roundedDoseMg: roundedTablets * kbrData.mgTablet
        };
    },

    calculateKbr(weightKg, sharedData, kbrData, tabletIncrement = 0.5){
        if(kbrData.concentration === KbrConcentrationOptions.ML)
            return this.calculateKbrLiquid(weightKg, sharedData, kbrData);

        if(kbrData.concentration === KbrConcentrationOptions.TABlET)
            return this.calculateKbrTablets(weightKg, sharedData, kbrData, tabletIncrement);

        return null;
    },

    calculateNaBrLiquid(weightKg, sharedData, naBrData){
        const dose = this.calculateDoseMg(weightKg, sharedData);

        if(!dose || naBrData.concentrationML <= 0)
            return null;

        return {
            compound: 'NaBr',
            dosageForm: 'liquid',
            ...dose,
            amount: dose.doseMg / naBrData.concentrationML,
            amountUnit: 'mL',
            concentration: naBrData.concentrationML,
            concentrationUnit: 'mg/mL'
        };
    }

};

export default BromideHelper;