<script setup>
import { useCalculator } from '../composables/Calculator.js';
import PatientChooser from './PatientChooser.vue';

const calculator = useCalculator();

</script>
<template>
    <div class="calculator-container">
        <PatientChooser />
        <div class="calc-area">
            <slot />
        </div>
    </div>
    <div class="results-cont" v-if="calculator.showResults.value">
        <slot name="results" />
        <button @click="calculator.saveCalculation()">Save Calculation</button>
    </div>
</template>
<style>

.calculator-container{
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    border: 0.2rem solid var(--color-primary);
    margin: 1rem;
    overflow: hidden;
}

.calc-area{
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
}

.calc-row{
    display: grid;
    grid-template-columns: 3fr 4fr;
    gap: 2rem;
    width: 100%;
}

.calc-row >:first-child{
    text-align: right;
    vertical-align: middle;
}

.calc-row >:last-child{
    text-align: left;
}

.row-label{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
}

.results-cont{
    padding: 1rem;
    border-radius: 1rem;
    background: var(--color-bg-secondary);
    overflow: hidden;
    margin: 1rem;
    border: 0.2rem solid var(--color-primary);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: center;
}

</style>