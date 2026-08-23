<script setup>
import { computed, ref, watch } from 'vue';
import { PatientSpecies } from '../../utils/PatientSpecies';
import { usePatient } from '../../composables/Patient';
import CalcRow from './CalcRow.vue';
import { useCalculator } from '../../composables/Calculator.js';
import CalcRowSelect from './CalcRowSelect.vue';
import CalcRowTwoOptions from './CalcRowTwoOptions.vue';

defineProps({
    onlyDogCat: {
        type: Boolean,
        default: false
    }
})

const patient = usePatient();
const calculator = useCalculator();
const speciesSelected = ref(PatientSpecies.DOG);

const showErrors = computed(() => 
    calculator.showErrors && !patient.validInputtedPatientSpecies
);

watch(() => patient.currentPatient?.value, (pat) => {
    speciesSelected.value = pat?.species ?? PatientSpecies.DOG;
}, { immediate: true, deep: true });


function handleSpeciesChange(){
    if(patient.inputtedPatient.value)
        patient.inputtedPatient.value.species = speciesSelected.value;
}

</script>
<template>
    <CalcRowSelect 
        v-if="!onlyDogCat"
        label="Species: "
        v-model="speciesSelected"
        :options="Object.values(PatientSpecies)"
        :show-error="showErrors"
        @change="handleSpeciesChange"
    />

    <CalcRowTwoOptions 
        v-else
        label="Species: "
        v-model="speciesSelected"
        :option1="{ label: PatientSpecies.DOG, value: PatientSpecies.DOG }"
        :option2="{ label: PatientSpecies.CAT, value: PatientSpecies.CAT }"
        :onChange="handleSpeciesChange"
    />
</template>
<style>
</style>