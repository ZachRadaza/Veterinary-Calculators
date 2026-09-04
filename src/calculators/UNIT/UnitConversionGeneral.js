import { ref } from "vue";
import UnitConversionHelper from "./UnitConversionHelper";

export function useUnitConversionGeneral(conversionUnits){
    const amount = ref(0);
    const unitFrom = ref(Object.keys(conversionUnits)[0]);
    const unitTo = ref(Object.keys(conversionUnits)[1]);

    const results = ref(null);

    function calculate(){
        results.value = UnitConversionHelper.calculateConversion(
            amount.value,
            unitFrom.value,
            unitTo.value,
            conversionUnits
        );
    }

    function reset(){
        amount.value = 0,
        unitFrom.value = Object.keys(conversionUnits)[0],
        unitTo.value = Object.keys(conversionUnits)[1]
    }

    return {
        amount, unitFrom, unitTo, results,
        calculate, reset
    };
}