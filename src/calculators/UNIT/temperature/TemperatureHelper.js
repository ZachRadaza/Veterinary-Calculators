import { TemperatureConversionUnits } from "./TemperatureConversionUnits";

const TemperatureHelper = {

    temparatureCalculateConversion(amount, conversionTo){
        const amountNum = Number(amount);
        let result;
        if(conversionTo === TemperatureConversionUnits.CELSIUS)
            result = this.convertToCelsius(amountNum);
        else
            result = this.convertToFahrenheit(amountNum);
            
        return result;
    },

    convertToFahrenheit(amount){
        const amountF = (amount * (9 / 5)) + 32;

        return{
            conversionFrom: TemperatureConversionUnits.CELSIUS,
            conversionFromAmount: amount,
            conversionTo: TemperatureConversionUnits.FAHRENHEIT,
            conversionToAmount: amountF
        };
    },

    convertToCelsius(amount){
        const amountC = (amount - 32) * (5 / 9) ;

        return{
            conversionFrom: TemperatureConversionUnits.CELSIUS,
            conversionFromAmount: amount,
            conversionTo: TemperatureConversionUnits.FAHRENHEIT,
            conversionToAmount: amountC
        };
    }
};

export default TemperatureHelper;