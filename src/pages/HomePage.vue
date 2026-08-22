<script setup>
import { ref } from 'vue';
import { CalculatorTypes } from '../calculators/CaclulatorTypes';
import Header from '../components/Header.vue';
import PatientChooser from '../components/PatientChooser.vue';

const currentTab = ref();

</script>
<template>
    <Header />
    <body>
        <h2 class="title">Veterinary Calculators</h2>
        <div class="content-container">
            <div class="calculator-list">
                <ul>
                    <li><RouterLink to="/bsa">{{ CalculatorTypes.BSA }}</RouterLink></li>
                    <li><RouterLink to="/bromide">{{ CalculatorTypes.BROMIDE }}</RouterLink></li>
                    <li><RouterLink to="/choctox">{{ CalculatorTypes.CHOCTOX }}</RouterLink></li>
                    <li><RouterLink to="/feedtube">{{ CalculatorTypes.FEEDTUBE }}</RouterLink></li>
                    <li><RouterLink to="/iron">{{ CalculatorTypes.IRON }}</RouterLink></li>
                </ul>
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