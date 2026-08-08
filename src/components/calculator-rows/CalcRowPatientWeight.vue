<script setup>
import { onMounted, ref, watch } from 'vue';
import { usePatient } from '../../composables/Patient.js';
import InputLabel from '../InputLabel.vue';
import { kgToLbs, lbsToKg, verifyNumberInput } from '../../utils/CalculatorUtils.js';
import CalcRow from './CalcRow.vue';

const patient = usePatient();

const patientLbs = ref('0');
const patientKgs = ref('0');

watch(() => patient.inputtedPatient?.value?.weight, (patWeight) => {
    patientLbs.value = patWeight ?? 0;
    patientKgs.value = lbsToKg(patWeight ?? 0);
}, { immediate: true });

function handleInputChange(isLbs){
    if(isLbs){
        patientLbs.value = verifyNumberInput(patientLbs.value, 0, 1000000);
        patientKgs.value = lbsToKg(Number(patientLbs.value));
    } else {
        patientKgs.value = verifyNumberInput(patientKgs.value, 0, 1000000);
        patientLbs.value = kgToLbs(Number(patientKgs.value));
    }

    if(patient.inputtedPatient?.value)
        patient.inputtedPatient.value.weight = Number(patientLbs.value);
}

</script>
<template>
    <CalcRow class="weight-row" label="Weight: ">
        <div class="flex-row">
            <InputLabel label="lbs" class="short" v-model="patientLbs" @input="handleInputChange(true)"/>
            <InputLabel label="kg" class="short" v-model="patientKgs" @input="handleInputChange(false)"/>
        </div>
    </CalcRow>
</template>
<style scoped>

</style>