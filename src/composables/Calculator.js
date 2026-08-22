import { computed, ref } from "vue";
import { CalculatorTypes } from "../calculators/CaclulatorTypes";
import { usePatient } from "./Patient";

const _currentCalcType = ref(null);

const currentCalcType = computed(() => _currentCalcType.value);
const showResults = ref(false);
const inputValues = ref('');
const showErrors = ref(false);
const calculatorCalculating = ref(false);

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
        calculatorCalculating.value = false;
    }

    function startCalculator(){
        showErrors.value = true;
        showResults.value = false;
        calculatorCalculating.value = true;
    }

    function endCalculator(){
        showResults.value = true;
        calculatorCalculating.value = false;
    }

    return { 
        currentCalcType, showResults, inputValues, showErrors, calculatorCalculating,
        setCurrentCalculatorType, saveCalculation, 
        resetCalculator, startCalculator, endCalculator
    };
}