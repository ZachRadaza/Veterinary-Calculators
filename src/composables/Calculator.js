import { computed, ref } from "vue";
import { CalculatorTypes } from "../calculators/CaclulatorTypes";
import { usePatient } from "./Patient";
import { PatientSpecies } from "../utils/PatientSpecies";

const _currentCalcType = ref(CalculatorTypes.BSA);

const currentCalcType = computed(() => _currentCalcType.value);

export function useCalculator(){

    const resetFunction = ref(() => {});
    const calculateFunction = ref(() => {});

    function setCurrentCalculatorType(type){
        _currentCalcType.value = type;
    }

    function calculate(){
        const patient = usePatient();
    }

    function reset(){
        const patient = usePatient();

        if(patient.currentPatient.value)
            patient.inputtedPatient.value = JSON.parse(JSON.stringify(patient.currentPatient.value));
        else
            patient.inputtedPatient.value = {
                id: -1,
                name: "",
                species: PatientSpecies.DOG,
                breed: "",
                weight: 0,
                sex: "Male",
                dob: "2004-07-07",
                createdAt: "",
            };
    }

    return { 
        currentCalcType, resetFunction, calculateFunction,
        setCurrentCalculatorType, reset, calculate
    };
}