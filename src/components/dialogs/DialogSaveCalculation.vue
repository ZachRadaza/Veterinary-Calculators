<script setup>
import { ref } from 'vue';
import Dialog from './Dialog.vue';
import LabeledInput from '../LabeledInput.vue';
import CalcRowInput from '../calculator-rows/CalcRowInput.vue';
import { usePatient } from '../../composables/Patient.js';
import { useCalculator } from '../../composables/Calculator.js';
import CalcRowSelect from '../calculator-rows/CalcRowSelect.vue';
import CalcRow from '../calculator-rows/CalcRow.vue';
import { useUser } from '../../composables/User.js';
import { useCalculation } from '../../composables/Calculation.js';

const patient = usePatient();
const calulator = useCalculator();
const user = useUser();
const calculation = useCalculation();

const dialogRef = ref(null);

const title = ref('');
const comments = ref('');
const selectedPatientId = ref('');
const loading = ref(false);

function setTitle(){
    const patientName = patient.currentPatient?.value?.name;
    const patientString = patientName ? `${patientName}: ` : '';
    const calculatorName = calulator.currentCalcType?.value.name;

    title.value = `${patientString}${calculatorName} Calculation`;
}

function openDialog(){
    selectedPatientId.value = patient.currentPatientId.value === -1 ? '' : patient.currentPatientId.value;
    setTitle();

    dialogRef.value?.dialogRef?.showModal();
}

function closeDialog(){
    dialogRef.value?.dialogRef?.close();
}

async function saveCalculation(){
    if(!selectedPatientId.value || !title.value || !calculation.calculationValues.value)
        return;

    loading.value = true;

    await calculation.saveCalculation(selectedPatientId.value, title.value, comments.value);

    loading.value = false;
    closeDialog();
}

defineExpose({
    openDialog,
    closeDialog
});

</script>
<template>
    <form @submit.prevent="saveCalculation">
        <Dialog ref="dialogRef" title="Save Calculation">

            <CalcRowInput 
                label="Title: "
                v-model="title"
                :has-default-num-bounds-check="false"
                :is-required="true"
                required
                class="long"
            />

            <CalcRow label="Save Calculation To: " :is-required="true">
                <select 
                    v-model="selectedPatientId"
                    required
                >
                    <option value="" disabled>-- Select a Patient --</option>
                    <option 
                        v-for="pat in patient.patientsList.value"
                        :key="pat.id"
                        :value="pat.id"
                    >
                        {{ pat.name }}
                    </option>
                </select>
            </CalcRow>

            <LabeledInput 
                label="Comments"
                v-model="comments"
                :is-text-area="true"
                rows="5"
            />

            <template #buttons>
                <button 
                    type="submit" 
                    id="save-calculation-btn"
                    :disabled="loading"
                >
                    Save Calculation
                </button>
                <button 
                    type="button" 
                    class="secondary"
                    formnovalidate
                    @click="closeDialog"
                >
                    Cancel
                </button>
            </template>
        </Dialog>
    </form>
</template>
<style scoped>

.calc-row{
    grid-template-columns: 1fr 2fr;
}

#save-calculation-btn:disabled{
    cursor: progress;
}
</style>