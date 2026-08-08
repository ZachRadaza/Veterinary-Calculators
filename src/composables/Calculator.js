import { computed, ref } from "vue";
import { CalculatorTypes } from "../calculators/CaclulatorTypes";
import { usePatient } from "./Patient";

const _currentCalcType = ref(CalculatorTypes.BSA);

const currentCalcType = computed(() => _currentCalcType.value);
const showResults = ref(false);
const inputValues = ref('');
const showErrors = ref(false);

export function useCalculator(){

    function setCurrentCalculatorType(type){
        _currentCalcType.value = type;
    }

    function saveCalculation(){
        const patient = usePatient();
    }

    function resetCalculator(){
        showErrors.value = false;
        showResults.value = false;
    }

    return { 
        currentCalcType, showResults, inputValues, showErrors,
        setCurrentCalculatorType, saveCalculation, resetCalculator
    };
}