<script setup>
import { computed } from 'vue';
import { CalculatorTypes } from '../calculators/CaclulatorTypes';
import Header from '../components/Header.vue';
import PatientChooser from '../components/PatientChooser.vue';
import { getRouterLinkTo } from '../router/index.js';

const calcAlphabetMap = computed(() => {
    const alphaMap = new Map();

    Object.values(CalculatorTypes).forEach(calc => {
        const startingLetter = calc.name[0].toUpperCase();

        if(alphaMap.has(startingLetter))
            alphaMap.get(startingLetter).push(calc);
        else 
            alphaMap.set(startingLetter, [calc]);
    });

    return alphaMap;
});

</script>
<template>
    <div class="page">
        <Header />
        <main>
            <h2 class="title">Veterinary Calculators</h2>
            <div class="content-container">
                <div class="calculator-list">
                    <div v-for="[letter, calcList] in calcAlphabetMap" class="flex-col">
                        <h3>{{ letter }}</h3>
                        <ul>
                            <li v-for="calc in calcList">
                                <RouterLink :to="getRouterLinkTo(calc.route)">{{ calc.name }}</RouterLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <PatientChooser />
            </div>

        </main>
    </div>
</template>
<style scoped>

main{
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 2rem;
}

.title{
    flex: none;
    text-align: center;
    margin: 1rem;
}

.content-container{
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 0.2rem solid var(--color-primary);
    border-radius: 1rem;
    margin: 1rem;
}

.calculator-list{
    flex: 1;
    min-height: 0;
    padding: 1rem;
    overflow-y: auto;
}

</style>