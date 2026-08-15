<script setup>
import { computed, ref, watch } from 'vue';
import DialogBoolean from './DialogBoolean.vue';
import { usePatient } from '../../composables/Patient';
import { lbsToKg } from '../../utils/CalculatorUtils.js';

const patient = usePatient();

const dialog = ref(null);
const description = computed(() => 
    `The weight you have entered 
        (${patient.inputtedPatient?.value?.weight ?? 0} lb / 
        ${lbsToKg(patient.inputtedPatient?.value?.weight ?? 0)} kg) 
    is different than the weight of the patient 
    (${patient.currentPatient?.value?.weight ?? 0} lb).`
);

watch(patient.currentPatient, (pat) => {
    if(!patient.currentAndInputtedWeightEqual.value && pat !== null){
        if(patient.inputtedPatient?.value?.weight === 0)
            updateInputtedWeight();
        else
            dialog.value?.openDialog();
    }
}, { deep: true });

function updateInputtedWeight(){
    patient.inputtedPatient.value.weight = patient.currentPatient?.value?.weight;
}

</script>
<template>
    <DialogBoolean
        ref="dialog"
        title="Patient Weight Input Change"
        :descriptions="[description, `Would you like to update the entry with the patient's weight?`]"
        :option-true="{ text: 'Yes, I want to update the weight', action: updateInputtedWeight }"
        :option-false="{ text: 'No, I want to keep entered weight', action: () => []}"
    />
</template>
<style scoped>

</style>