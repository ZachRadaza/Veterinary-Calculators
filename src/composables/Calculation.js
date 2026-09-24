import { computed, ref, watch } from "vue";
import CalculationService from "../services/CalculationService";
import { useUser } from "./User";
import { useCalculator } from "./Calculator";
import { usePatient } from "./Patient";

const _calculations = ref(new Map());
const _savedCalculation = ref(null);
const _calculationValues = ref(null);

const calculations = computed(() => [..._calculations.value.values()]);
const savedCalculation = computed(() => _savedCalculation.value);
const calculationValues = computed(() => _calculationValues.value);

function getCalculation(calculationId){
    return _calculations.value.get(calculationId);
}

function setSavedCalculation(savedCalc){
    _savedCalculation.value = savedCalc;
}

function setCalculationValueHelper(inputtedPatient, calcValues){
    const completeCalcValues = {
        patient: inputtedPatient,
        ...calcValues
    }

    _calculationValues.value = completeCalcValues;
}

async function loadAllPatientSavedCalculationsHelper(userId, patientId){
    try{
        const loadedCalculations = await CalculationService.getCalculations(
            userId, 
            patientId,
        );

        _calculations.value = new Map(loadedCalculations.map(calc => [calc.id, calc]));
    } catch(error){
        console.error('Error in loading all saved calculations: ', error);
    }
}

async function loadPatientSavedCalculationsHelper(userId, patientId, calculatorId){
    try{
        const loadedCalculations = _calculations.value = await CalculationService.getCalculatorCalculations(
            userId,
            patientId,
            calculatorId
        );

        _calculations.value = new Map(loadedCalculations.map(calc => [calc.id, calc]));
    } catch(error){
        console.error('Error in loading saved calculations: ', error);
    }
}

async function loadSavedCalculationHelper(userId, patientId, calculationId){
    try{            
        if(!userId || !calculationId && calculationId !== -1)
            return;

        if(patientId && patientId !== -1)
            _savedCalculation.value = await CalculationService.getCalculation(
                userId,
                patientId,
                calculationId
            );
        else
            _savedCalculation.value = await CalculationService.getCalculationNoPatientId(
                userId,
                calculationId
            );

        return _savedCalculation.value?.calculationValues;
    } catch(error){
        console.error('Error in loading saved calculation: ', error);
    }
}

async function saveCalculationHelper(userId, patientId, title, comments, calcTypeId){
    try{
        const newCalculation = await CalculationService.addCalculation(
            userId,
            patientId,
            title,
            comments,
            calculationValues.value,
            calculator.currentCalcType?.value?.calculatorId
        );

        _calculations.value.set(newCalculation.id, newCalculation);            
    } catch(error){
        console.error('Error in saving calculation: ', error);
    }
}

async function updateCalculationHelper(userId, patientId, calculationId, calculation){
    try{
        const updatedCalcuation = await CalculationService.updateCalculation(
            userId,
            patientId,
            calculationId,
            calculation
        );

        _calculations.value.set(updatedCalcuation.id, updatedCalcuation);
    } catch(error){
        console.error('Error in updating calculation', error);
    }
}

async function deleteCalculationHelper(userId, patientId, calculationId){
    try{
        await CalculationService.deleteCalculation(userId, patientId, calculationId);

        _calculations.value.delete(calculationId);
    } catch(error){
        console.error('Error in deleting calculation', error);
    } 
}

export function useCalculation(){

    const user = useUser();
    const calculator = useCalculator();
    const patient = usePatient();

    function init(calcRefs = {}, calculate){
        watch(savedCalculation, (savedCalc) => {
            if(!savedCalc)
                return;

            const calcValues = savedCalc?.calculationValues;

            Object.entries(calcRefs).forEach(([key, valueRef]) => {
                if(key in calcValues)
                    valueRef.value = calcValues[key];
            });

            calculate?.();
        }, { immediate: true });
    }

    function setCalculationValue(calcValues){
        setCalculationValueHelper(patient.inputtedPatient.value, calcValues);
    }

    async function loadAllPatientSavedCalculations(patientId){
        return loadAllPatientSavedCalculationsHelper(user.userId.value, patientId);
    }

    async function loadPatientSavedCalculations(patientId, calculatorId){
        return loadAllPatientSavedCalculationsHelper(user.userId.value, patientId, calculatorId);
    }

    async function loadSavedCalculation(patientId, calculationId){
        return loadSavedCalculationHelper(user.userId.value, patientId, calculationId);
    }

    async function saveCalculation(patientId, title, comments, calcTypeId){
        return saveCalculationHelper(user.userId.value, patientId, title, comments. calcTypeId);
    }

    async function updateCalculation(patientId, calculationId, calculation){
        return updateCalculationHelper(user.userId.value, patientId, calculationId, calculation);
    }

    async function deleteCalculation(patientId, calculationId){
        return deleteCalculationHelper(user.userId.value, patientId, calculationId);
    }

    return {
        calculations, savedCalculation, calculationValues,
        loadPatientSavedCalculations, loadAllPatientSavedCalculations, loadSavedCalculation,
        saveCalculation, init,
        setSavedCalculation, setCalculationValue, 
        getCalculation, deleteCalculation, updateCalculation
    };
}