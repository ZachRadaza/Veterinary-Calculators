<script setup>
import { onMounted, ref } from 'vue';
import CalcRowCalculateBtns from '../../components/calculator-rows/CalcRowCalculateBtns.vue';
import CalcRowPatientSpecies from '../../components/calculator-rows/CalcRowPatientSpecies.vue';
import CalcRowPatientWeight from '../../components/calculator-rows/CalcRowPatientWeight.vue';
import CalculatorTemplate from '../../components/CalculatorTemplate.vue';
import { useCalculator } from '../../composables/Calculator.js';
import { usePatient } from '../../composables/Patient.js';
import BSAHelper from './BSAHelper.js';
import { lbsToKg, roundToThousandth } from '../../utils/CalculatorUtils.js';

const patient = usePatient();
const calculator = useCalculator();

const bsa = ref(0);

function calculate(){
    const patientEntered = patient.inputtedPatient?.value;
    const weightKg = lbsToKg(patientEntered?.weight);
    bsa.value = roundToThousandth(BSAHelper.calculateBSA(weightKg, patientEntered?.species));

    calculator.showResults.value = true;
}

function reset(){
    patient.resetInputtedPatient();
    calculator.showResults.value = false;
}

</script>
<template>
    <CalculatorTemplate>
        <CalcRowPatientWeight />
        <CalcRowPatientSpecies />
        <CalcRowCalculateBtns :calculate="calculate" :reset="reset"/>

        <template #results>
            <h5>Body Surface Area = {{ bsa }} m²</h5>
            <h6>This result is obtained through the <a>Classic Formula</a></h6>
        </template>
    </CalculatorTemplate>
</template>
<style>

.calc-content{
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
}

</style>