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

    function getCalculation(calculationId){
        return _calculations.value.get(calculationId);
    }

    function setSavedCalculation(savedCalc){
        _savedCalculation.value = savedCalc;
    }

    function setCalculationValue(calcValues){
        const completeCalcValues = {
            patient: patient.inputtedPatient.value,
            ...calcValues
        }

        _calculationValues.value = completeCalcValues;
    }

    async function loadAllPatientSavedCalculations(patientId){
        try{
            const loadedCalculations = await CalculationService.getCalculations(
                user.userId.value, 
                patientId,
            );

            _calculations.value = new Map(loadedCalculations.map(calc => [calc.id, calc]));
        } catch(error){
            console.error('Error in loading all saved calculations: ', error);
        }
    }

    async function loadPatientSavedCalculations(patientId, calculatorId){
        try{
            const loadedCalculations = _calculations.value = await CalculationService.getCalculatorCalculations(
                user.userId.value,
                patientId,
                calculatorId
            );

            _calculations.value = new Map(loadedCalculations.map(calc => [calc.id, calc]));
        } catch(error){
            console.error('Error in loading saved calculations: ', error);
        }
    }

    async function loadSavedCalculation(patientId, calculationId){
        try{            
            if(!user.userId.value || !calculationId && calculationId !== -1)
                return;

            if(patientId && patientId !== -1)
                _savedCalculation.value = await CalculationService.getCalculation(
                    user.userId.value,
                    patientId,
                    calculationId
                );
            else
                _savedCalculation.value = await CalculationService.getCalculationNoPatientId(
                    user.userId.value,
                    calculationId
                );

            return _savedCalculation.value?.calculationValues;
        } catch(error){
            console.error('Error in loading saved calculation: ', error);
        }
    }

    async function saveCalculation(patientId, title, comments, calcTypeId){
        try{
            const newCalculation = await CalculationService.addCalculation(
                user.userId.value,
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

    async function updateCalculation(patientId, calculationId, calculation){
        try{
            const updatedCalcuation = await CalculationService.updateCalculation(
                user.userId.value,
                patientId,
                calculationId,
                calculation
            );

            _calculations.value.set(updatedCalcuation.id, updatedCalcuation);
        } catch(error){
            console.error('Error in updating calculation', error);
        }
    }

    async function deleteCalculation(patientId, calculationId){
        try{
            await CalculationService.deleteCalculation(user.userId.value, patientId, calculationId);

            _calculations.value.delete(calculationId);
        } catch(error){
            console.error('Error in deleting calculation', error);
        }
    }

    return {
        calculations, savedCalculation, calculationValues,
        loadPatientSavedCalculations, loadAllPatientSavedCalculations, loadSavedCalculation,
        saveCalculation, init,
        setSavedCalculation, setCalculationValue, 
        getCalculation, deleteCalculation, updateCalculation
    };
}