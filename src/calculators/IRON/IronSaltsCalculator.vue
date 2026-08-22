<script setup>
import { computed, ref } from 'vue';
import CalcRowSelect from '../../components/calculator-rows/CalcRowSelect.vue';
import CalculatorTemplate from '../../components/CalculatorTemplate.vue';
import { IronSaltTypes } from './IronSaltTypes.js';
import { useCalculator } from '../../composables/Calculator.js';
import CalcRowCalculateBtns from '../../components/calculator-rows/CalcRowCalculateBtns.vue';
import CalcRowInputLabel from '../../components/calculator-rows/CalcRowInputLabel.vue';
import IronSaltHelper from './IronSaltsHelper.js';
import { roundToThousandth } from '../../utils/CalculatorUtils.js';

const calculator = useCalculator();

const ironSalt = ref(0);
const amountMg = ref(0);
const result = ref(null);

const showIronSaltError = computed(() => 
    ironSalt.value === 0 && calculator.showErrors.value
);
const showAmountMgError = computed(() => 
    amountMg.value === 0 && calculator.showErrors.value
);

function calculate(){
    calculator.startCalculator();

    if(ironSalt.value === 0)
        return;

    if(amountMg.value === 0)
        return;

    result.value = IronSaltHelper.calculateElementalIron(ironSalt.value, amountMg.value);

    calculator.endCalculator();
}

function reset(){
    calculator.resetCalculator();
}

</script>
<template>
    <CalculatorTemplate>
        <CalcRowSelect 
            label="Iron Salt: "
            v-model="ironSalt"
            :options="Object.keys(IronSaltTypes)"
            default-option-label="Select Iron Salt"
            :show-error="showIronSaltError"
        />

        <CalcRowInputLabel 
            label="Amount: "
            v-model="amountMg"
            input-label="mg"
            :error="showAmountMgError"
            class="short"
        />

        <CalcRowCalculateBtns :calculate="calculate" :reset="reset"/>

        <template #results>
            <h5>Elemental Iron Equivalent: {{ roundToThousandth(result) }} mg</h5>
        </template>
    </CalculatorTemplate>
</template>
<style scoped>
</style>