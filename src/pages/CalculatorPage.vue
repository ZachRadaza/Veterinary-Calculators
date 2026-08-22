<script setup>
import { computed } from 'vue';
import { useCalculator } from '../composables/Calculator';
import Header from '../components/Header.vue';

const calculator = useCalculator();

const calcTypeComponent = computed(() => 
    calculator.currentCalcType.value?.component
);

</script>
<template>
    <Header />
    <body>
        <h2 class="title">{{ calculator.currentCalcType.value?.name }} Calculator</h2>
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