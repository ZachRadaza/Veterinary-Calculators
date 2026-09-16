<script setup>
import { computed, watch } from 'vue';
import { useCalculator } from '../composables/Calculator';
import Header from '../components/Header.vue';
import { usePatient } from '../composables/Patient.js';
import { useCalculation } from '../composables/Calculation.js';
import router from '../router/index.js';
import { useUser } from '../composables/User.js';

const calculator = useCalculator();
const patient = usePatient();
const calculation = useCalculation();
const user = useUser();

const calcTypeComponent = computed(() => 
    calculator.currentCalcType.value?.component
);

watch(
    [
        () => router.currentRoute.value.query.calculationId,
        () => router.currentRoute.value.query.patientId,
        user.userId
    ],
    async ([calculationId, patientId, userId]) => {
        if(!userId || !calculationId)
            return;

        const savedCalc = await calculation.loadSavedCalculation(
            patientId,
            calculationId
        );

        patient.inputtedPatient.value = savedCalc?.patient ?? null;
    },
    { immediate: true }
);

watch(
    [
        () => router.currentRoute.value.query.patientId,
        () => calculator.currentCalcType.value?.calculatorId,
        user.userId
    ],
    async ([patientId, calculatorId, userId]) => {
        if(!userId || !patientId || !calculatorId)
            return;

        await calculation.loadPatientSavedCalculations(
            patientId,
            calculatorId
        );
    },
    { immediate: true }
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