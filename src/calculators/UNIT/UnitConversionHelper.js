const UnitConversionHelper = {

    calculateConversion(amount, fromUnit, toUnit, conversionUnits){
        const numericAmount = Number(amount);
        const fromFactor = conversionUnits[fromUnit];
        const toFactor = conversionUnits[toUnit];

        const convertedAmount = numericAmount * fromFactor / toFactor;

        return {
            fromAmount: numericAmount,
            fromUnit,
            toAmount: convertedAmount,
            toUnit
        };
    }
};

export default UnitConversionHelper;