<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { usePatient } from '../../composables/Patient.js';
import InputLabel from '../InputLabel.vue';
import { kgToLbs, lbsToKg, verifyNumberInput } from '../../utils/CalculatorUtils.js';
import CalcRow from './CalcRow.vue';
import { useCalculator } from '../../composables/Calculator.js';
import DialogPatientWeightChange from '../dialogs/DialogPatientWeightChange.vue';
import DialogInfo from '../dialogs/DialogInfo.vue';
import { useInvalidInputDialog } from '../../composables/InvalidInputDialog.js';

const patient = usePatient();
const calculator = useCalculator();

const patientLbs = ref('0');
const patientKgs = ref('0');

const showErrors = computed(() =>
    !patient.validInputtedPatientWeight.value && calculator.showErrors.value
);

const invalidInputDialog = useInvalidInputDialog(showErrors, 'Patient Weight');

onMounted(() => {
    invalidInputDialog.init();
});

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
            <InputLabel 
                label="lbs" 
                v-model="patientLbs"
                @input="handleInputChange(true)" 
                :error="showErrors"
                class="short"
                :has-default-num-bounds-check="false"
            />
            <InputLabel 
                label="kg" 
                v-model="patientKgs" 
                @input="handleInputChange(false)"
                :error="showErrors"
                class="short" 
                :has-default-num-bounds-check="false"
            />
        </div>

        <!-- Dialogs -->
        <DialogPatientWeightChange />

        <DialogInfo
            :ref="invalidInputDialog.dialogRef"
            title="Incomplete Input"
            :descriptions="[invalidInputDialog.dialogLabel.value]"
        />
    </CalcRow>
</template>
<style scoped>

</style>