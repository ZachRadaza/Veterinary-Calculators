import { BloodTestConversionUnits } from "./BloodTestConversionUnits";

const BloodTestHelper = {

    calculateBloodConversion(amount, bloodTest, conversionUnits) {
        const numericAmount = Number(amount);

        const convertedAmount = conversionUnits === BloodTestConversionUnits.UStoSI
            ? numericAmount * bloodTest.value
            : numericAmount / bloodTest.value;

        return {
            bloodTest: bloodTest.name,
            originalAmount: numericAmount,
            originalUnit: conversionUnits === BloodTestConversionUnits.UStoSI
                ? bloodTest.unitsUS
                : bloodTest.unitsSI,
            convertedAmount,
            convertedUnit: conversionUnits === BloodTestConversionUnits.SItoUS
                ? bloodTest.unitsSI
                : bloodTest.unitsUS
        };
    }
};

export default BloodTestHelper;