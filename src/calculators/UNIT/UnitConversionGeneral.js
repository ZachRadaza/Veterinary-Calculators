import { ref } from "vue";
import UnitConversionHelper from "./UnitConversionHelper";
import { useCalculator } from "../../composables/Calculator";
import { usePatient } from "../../composables/Patient";

export function useUnitConversionGeneral(conversionUnits, tab){
    const calculator = useCalculator();
    const patient = usePatient();

    const values = ref({
        amount: 0,
        unitFrom: Object.keys(conversionUnits)[0],
        unitTo: Object.keys(conversionUnits)[1]
    })
    const results = ref(null);

    function calculate(){
        calculator.startCalculator();
        results.value = UnitConversionHelper.calculateConversion(
            values.value.amount,
            values.value.unitFrom,
            values.value.unitTo,
            conversionUnits
        );

        calculator.endCalculator();
    }

    function reset(){
        calculator.resetCalculator();
        patient.resetInputtedPatient();

        values.value = {
            amount: 0,
            unitFrom: Object.keys(conversionUnits)[0],
            unitTo: Object.keys(conversionUnits)[1]
        }
    }

    return {
        values, results,
        calculate, reset
    };
}