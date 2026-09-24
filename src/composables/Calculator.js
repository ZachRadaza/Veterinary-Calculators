import { computed, ref } from "vue";
import { CalculatorTypes } from "../calculators/CaclulatorTypes";

const _currentCalcType = ref(null);

const showResults = ref(false);
const inputValues = ref('');
const showErrors = ref(false);
const calculatorCalculating = ref(false);

const currentCalcType = computed(() => _currentCalcType.value);

function setCurrentCalculatorType(type){
    _currentCalcType.value = type;
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

export function useCalculator(){
    return { 
        currentCalcType, showResults, inputValues, showErrors, calculatorCalculating,
        setCurrentCalculatorType,
        resetCalculator, startCalculator, endCalculator
    };
}