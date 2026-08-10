<script setup>
import { computed, ref, watch } from 'vue';
import { PatientSpecies } from '../../utils/PatientSpecies';
import { usePatient } from '../../composables/Patient';
import CalcRow from './CalcRow.vue';
import { useCalculator } from '../../composables/Calculator.js';
import CalcRowSelect from './CalcRowSelect.vue';

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
    <CalcRowSelect 
        label="Species: "
        v-model="speciesSelected"
        :options="Object.values(PatientSpecies)"
        :show-error="showErrors"
        @change="handleSpeciesChange"
    />
</template>
<style>
</style>