<script setup>
import { computed } from 'vue';
import { CalculatorTypes } from '../calculators/CaclulatorTypes';
import Header from '../components/Header.vue';
import PatientChooser from '../components/PatientChooser.vue';

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
    <Header />
    <body>
        <h2 class="title">Veterinary Calculators</h2>
        <div class="content-container">
            <div class="calculator-list">
                <div v-for="[letter, calcList] in calcAlphabetMap" class="flex-col">
                    <h3>{{ letter }}</h3>
                    <ul>
                        <li v-for="calc in calcList">
                            <RouterLink :to="calc.route">{{ calc.name }}</RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
            <PatientChooser />
        </div>

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

.content-container{
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 0.2rem solid var(--color-primary);
    border-radius: 1rem;
    margin: 1rem;
}

.calculator-list{
    padding: 1rem;
}

</style>