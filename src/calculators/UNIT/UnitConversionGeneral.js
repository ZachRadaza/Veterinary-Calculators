import { ref } from "vue";
import UnitConversionHelper from "./UnitConversionHelper";
import { useCalculator } from "../../composables/Calculator";

export function useUnitConversionGeneral(conversionUnits, tab){
    const amount = ref(0);
    const unitFrom = ref(Object.keys(conversionUnits)[0]);
    const unitTo = ref(Object.keys(conversionUnits)[1]);

    const results = ref(null);

    function calculate(){
        const calculator = useCalculator();
        const calculatorValues = {
            amount: amount.value,
            unitFrom: unitFrom.value,
            unitTo: unitTo.value,
            currentTab: tab
        };

        calculator.startCalculator(calculatorValues);

        results.value = UnitConversionHelper.calculateConversion(
            amount.value,
            unitFrom.value,
            unitTo.value,
            conversionUnits
        );

        calculator.endCalculator();
    }

    function reset(){
        const calculator = useCalculator();
        calculator.resetCalculator();

        amount.value = 0,
        unitFrom.value = Object.keys(conversionUnits)[0],
        unitTo.value = Object.keys(conversionUnits)[1]
    }

    return {
        amount, unitFrom, unitTo, results,
        calculate, reset
    };
}