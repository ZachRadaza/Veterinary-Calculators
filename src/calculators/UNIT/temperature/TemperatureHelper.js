import { TemperatureConversionUnits } from "./TemperatureConversionUnits";

const TemperatureHelper = {

    temparatureCalculateConversion(amount, toUnit){
        const amountNum = Number(amount);
        let result;
        if(toUnit === TemperatureConversionUnits.CELSIUS)
            result = this.convertToCelsius(amountNum);
        else
            result = this.convertToFahrenheit(amountNum);
            
        return result;
    },

    convertToFahrenheit(amount){
        const amountF = (amount * (9 / 5)) + 32;

        return{
            fromUnit: TemperatureConversionUnits.CELSIUS,
            fromAmount: amount,
            toUnit: TemperatureConversionUnits.FAHRENHEIT,
            toAmount: amountF
        };
    },

    convertToCelsius(amount){
        const amountC = (amount - 32) * (5 / 9) ;

        return{
            fromUnit: TemperatureConversionUnits.FAHRENHEIT,
            fromAmount: amount,
            toUnit: TemperatureConversionUnits.CELSIUS,
            toAmount: amountC
        };
    }
};

export default TemperatureHelper;