<script setup>
import { ref } from 'vue';
import CalcRowInput from '../../components/calculator-rows/CalcRowInput.vue';
import CalcRowPatientSpecies from '../../components/calculator-rows/CalcRowPatientSpecies.vue';
import CalcRowPatientWeight from '../../components/calculator-rows/CalcRowPatientWeight.vue';
import CalculatorTemplate from '../../components/CalculatorTemplate.vue';
import CalcRowCalculateBtns from '../../components/calculator-rows/CalcRowCalculateBtns.vue';
import { useCalculator } from '../../composables/Calculator.js';
import { usePatient } from '../../composables/Patient.js';
import { lbsToKg, roundToThousandth } from '../../utils/CalculatorUtils.js';
import TransfusionHelper from './TransfusionHelper.js';
import CalcRow from '../../components/calculator-rows/CalcRow.vue';

const calculator = useCalculator();
const patient = usePatient();

const HCTValues = ref({
    HCTa: 0,
    HCTt: 0,
    HCTd: 0
});
const result = ref(null);

function calculate(){
    calculator.startCalculator();

    if(!patient.validateInputtedPatient())
        return;

    if(HCTValues.value.HCTa <= 0 || HCTValues.value.HCTt <= 0 || HCTValues.value.HCTd <= 0)
        return;

    const weightKg = lbsToKg(patient.inputtedPatient.value.weight);
    const transfusionResult = TransfusionHelper.calculateTransfusionVolume(
        weightKg, 
        patient.inputtedPatient.value.species,
        HCTValues.value.HCTa,
        HCTValues.value.HCTt,
        HCTValues.value.HCTd
    );

    result.value = transfusionResult;

    calculator.endCalculator();
}

function reset(){
    calculator.resetCalculator();
    patient.resetInputtedPatient();

    HCTValues.value = {
        HCTa: 0,
        HCTt: 0,
        HCTd: 0
    };
}

</script>
<template>
    <CalculatorTemplate>
        <CalcRowPatientSpecies 
            :only-dog-cat="true"
        />

        <CalcRowPatientWeight />
        
        <CalcRowInput 
            label="Actual (current) hematocrit (HCTa): "
            v-model="HCTValues.HCTa"
            class="short"
            :error="HCTValues.HCTa <= 0 && calculator.showErrors.value"
        />

        <CalcRowInput 
            label="Desired (target) hematocrit (HCTt): "
            v-model="HCTValues.HCTt"
            class="short"
            :error="HCTValues.HCTt <= 0 && calculator.showErrors.value"
        />

        <CalcRowInput 
            label="Donor hematocrit (HCTd): "
            v-model="HCTValues.HCTd"
            class="short"
            :error="HCTValues.HCTd <= 0 && calculator.showErrors.value"
        />

        <CalcRowCalculateBtns :calculate="calculate" :reset="reset"/>

        <template #results>
            <CalcRow label="Current patient blood volume: ">
                <h5>{{ roundToThousandth(result.patientBloodVolume) }} ml</h5>
            </CalcRow>
            <CalcRow label="To reach desired hematocrit, TRANSFUSE: ">
                <h5 v-if="result.transfusionRequired">{{ roundToThousandth(result.transfusionVolume) }} ml of Blood</h5>
                <h5 v-else>
                    No transfusion volume indicated—the target HCT does not exceed the current HCT.
                </h5>
            </CalcRow>
        </template>
    </CalculatorTemplate>
</template>
<style scoped>
</style>