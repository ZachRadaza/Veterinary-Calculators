<script setup>
import { onMounted, ref } from 'vue';
import { useCalculator } from '../composables/Calculator.js';
import PatientChooser from './PatientChooser.vue';
import { usePatient } from '../composables/Patient.js';
import DialogSaveCalculation from './dialogs/DialogSaveCalculation.vue';
import { useCalculation } from '../composables/Calculation.js';
import { useRouter } from 'vue-router';

const calculator = useCalculator();
const patient = usePatient();
const calculation = useCalculation();
const router = useRouter();

const dialogSaveCalculation = ref(null);

const emit = defineEmits(['save-calculation-clicked']);

onMounted(async () => {
    calculator.resetCalculator();
    patient.resetInputtedPatient();

    const calcId = calculator.currentCalcType?.value?.calculatorId;
    if(calcId)
        await calculation.loadPatientSavedCalculations(
            patient.currentPatientId.value, 
            calcId
        );
});

function handleSaveCalculation(){
    emit('save-calculation-clicked');
    dialogSaveCalculation.value?.openDialog();
}

function openSavedCalculation(calculationId, patientId){
    router.push({ query: { calculationId, patientId } });
}

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
        <button @click="handleSaveCalculation">Save Calculation</button>
    </div>

    <div class="saved-calculations flex-col" v-if="calculation.calculations?.value?.length > 0">
        <h5>{{ patient.currentPatient?.value?.name }}'s Saved Calculations</h5>
        <div class="calculations">
            <button
                v-for="savedCalc in calculation.calculations.value"
                :key="savedCalc.id"
                @click="openSavedCalculation(savedCalc.id, savedCalc.patientId)"
            >
                {{ savedCalc.title }}
            </button>
        </div>
    </div>

    <DialogSaveCalculation 
        ref="dialogSaveCalculation"
    />
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

h1, h2, h3, h4, h5, h6, p{
    line-height: 2;
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
    text-align: right;
}

.radio-row{
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
}

.radio-col{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;
}

.radio-row.top{
    align-items: start;
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

.flex-row{
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
}

.flex-col{
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.calculations{
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
}

</style>