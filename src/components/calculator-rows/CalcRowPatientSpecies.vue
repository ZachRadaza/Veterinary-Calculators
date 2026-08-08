<script setup>
import { computed, ref, watch } from 'vue';
import { PatientSpecies } from '../../utils/PatientSpecies';
import { usePatient } from '../../composables/Patient';
import CalcRow from './CalcRow.vue';
import { useCalculator } from '../../composables/Calculator.js';

const patient = usePatient();
const calculator = useCalculator();
const speciesSelected = ref(PatientSpecies.DOG);

const showErrors = computed(() => 
    calculator.showErrors && !patient.validInputtedPatientSpecies
);

watch(() => patient.inputtedPatient?.value, (pat) => {
    speciesSelected.value = pat?.species ?? PatientSpecies.DOG;
}, { immediate: true });


function handleSpeciesChange(){
    if(patient.inputtedPatient.value)
        patient.inputtedPatient.value.species = speciesSelected.value;
}

</script>
<template>
    <CalcRow class="species-row" label="Species: ">
        <select v-model="speciesSelected" :class="`${showErrors ? 'error' : ''}`">
            <option v-for="specie in Object.values(PatientSpecies)" :value="specie" @change="handleSpeciesChange()">{{ specie }}</option>
        </select>
    </CalcRow>
</template>
<style>
</style>