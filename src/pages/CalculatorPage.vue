<script setup>
import { computed, watch } from 'vue';
import { useCalculator } from '../composables/Calculator';
import Header from '../components/Header.vue';
import { useRoute, useRouter } from 'vue-router';
import { usePatient } from '../composables/Patient.js';
import { useCalculation } from '../composables/Calculation.js';

const calculator = useCalculator();
const route = useRoute();
const router = useRouter();
const patient = usePatient();
const calculation = useCalculation();

const calcTypeComponent = computed(() => 
    calculator.currentCalcType.value?.component
);

watch(patient.currentPatientId, async (patId) => {
    const calcId = calculator.currentCalcType?.value?.calculatorId;

    if(calcId)
        await calculation.loadPatientSavedCalculations(
            patId, 
            calcId
        );

    router.push({query: { patientId: patId }})
});

watch(() => route.query, async (query) => {
    if(query?.patientId !== patient.currentPatientId.value)
        patient.setCurrentPatientId(query?.patientId);

    if(query?.calculationId){
        const savedCalc = await calculation.loadSavedCalculation(
            patient.currentPatientId.value, 
            query.calculationId
        );

        patient.inputtedPatient.value = savedCalc?.patient;
    }
}, { immediate: true, deep: true });

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