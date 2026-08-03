<script setup>
import { computed } from 'vue';
import { useCalculator } from '../composables/Calculator';
import { CalculatorTypeToComp } from '../calculators/CalculatorTypeToComp';
import Header from '../components/Header.vue';

const calculator = useCalculator();

const calcTypeComponent = computed(() => 
    CalculatorTypeToComp[calculator.currentCalcType.value] ?? null
);

</script>
<template>
    <Header />
    <body>
        <h2 class="title">{{ calculator.currentCalcType }} Calculator</h2>
        <component :is="calcTypeComponent" />
    </body>
</template>
<style scoped>

    body{
        padding: 2rem;
    }

    .title{
        text-align: center;
        margin: 1rem;
    }

</style>