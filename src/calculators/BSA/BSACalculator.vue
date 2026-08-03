<script setup>
import CalcRowCalculateBtns from '../../components/calculator-rows/CalcRowCalculateBtns.vue';
import CalcRowPatientSpecies from '../../components/calculator-rows/CalcRowPatientSpecies.vue';
import CalcRowPatientWeight from '../../components/calculator-rows/CalcRowPatientWeight.vue';
import CalculatorTemplate from '../../components/CalculatorTemplate.vue';
import { useCalculator } from '../../composables/Calculator.js';

const calculator = useCalculator();

function calculate(){

}

function reset(){
    calculator.reset();
}

</script>
<template>
    <CalculatorTemplate>
        <CalcRowPatientWeight />
        <CalcRowPatientSpecies />
        <CalcRowCalculateBtns :calculate="calculate" :reset="reset"/>
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