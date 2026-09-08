<script setup>
import { computed, ref } from 'vue';
import Dialog from './Dialog.vue';
import CalcRowInput from '../calculator-rows/CalcRowInput.vue';
import CalcRowSelect from '../calculator-rows/CalcRowSelect.vue';
import { PatientSpecies } from '../../utils/PatientSpecies.js';
import CalcRowTwoOptions from '../calculator-rows/CalcRowTwoOptions.vue';
import { PatientSex } from '../../utils/PatientSex.js';
import LabeledInput from '../LabeledInput.vue';
import { formatDateForInput } from '../../utils/DateUtils.js';
import CalcRowInputLabel from '../calculator-rows/CalcRowInputLabel.vue';

const { isEditing, patient } = defineProps({
    isEditing: {
        type: Boolean,
        required: true,
        default: false
    },
    patient: {
        required: true,
        default: {}
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emitEvent = defineEmits(['save']);

const defaultPatientInput = Object.freeze({
    name: '', 
    species: PatientSpecies.DOG, 
    breed: '', 
    weight: '', 
    sex: PatientSex.MALE, 
    dateOfBirth: formatDateForInput(new Date()), 
    patientNum: '', 
    clientName: '', 
    color: '', 
    comments: ''
});

const dialogRef = ref(null);
const patientInputCopy = ref({...defaultPatientInput});

const dialogTitle = computed(() => isEditing ? 'Edit/View Patient' : 'Add Patient');

function openDialog(){
    patientInputCopy.value = patient ? {...patient} : {...defaultPatientInput};

    dialogRef.value?.dialogRef?.showModal();
}

function closeDialog(){
    dialogRef.value?.dialogRef?.close();
}

function handleSave(){
    emitEvent('save', patientInputCopy.value);
}

defineExpose({
    openDialog,
    closeDialog,
});
</script>
<template>
    <form @submit.prevent="handleSave">
        <Dialog :title="dialogTitle" ref="dialogRef">

            <CalcRowInput 
                label="Name: " 
                v-model="patientInputCopy.name"
                :has-default-num-bounds-check="false"
                required
                :is-required="true"
                placeholder="Rocky"
            />

            <CalcRowInput 
                label="Patient #: " 
                v-model="patientInputCopy.patientNum"
                :has-default-num-bounds-check="false"
            />

            <CalcRowInput 
                label="Client Name: " 
                v-model="patientInputCopy.clientName"
                :has-default-num-bounds-check="false"
            />

            <CalcRowSelect 
                label="Species: "
                v-model="patientInputCopy.species"
                :options="Object.values(PatientSpecies)"
                required
                :is-required="true"
            />

            <CalcRowInput 
                label="Breed: " 
                v-model="patientInputCopy.breed"
                :has-default-num-bounds-check="false"
                required
                :is-required="true"
                placeholder="Eridian"
            />

            <CalcRowInput 
                label="Date of Birth: " 
                v-model="patientInputCopy.dateOfBirth"
                :has-default-num-bounds-check="false"
                type="date"
                class="short"
                required
                :is-required="true"
                :max="new Date().toLocaleDateString('en-CA')"
            />

            <CalcRowInputLabel
                label="Weight: " 
                v-model="patientInputCopy.weight"
                input-label="lbs"
                class="short"
                required
                :is-required="true"
                placeholder="168"
            />

            <CalcRowTwoOptions 
                label="Sex: "    
                v-model="patientInputCopy.sex"
                :option1="{ label: PatientSex.MALE, value: PatientSex.MALE }"
                :option2="{ label: PatientSex.FEMALE, value: PatientSex.FEMALE }"
            />

            <CalcRowInput 
                label="Color:  " 
                v-model="patientInputCopy.color"
                :has-default-num-bounds-check="false"
            />

            <LabeledInput 
                label="Comments"
                v-model="patientInputCopy.comments"
                :is-text-area="true"
                rows="3"
            />

            <template #buttons>
                <button 
                    type="submit" 
                    :disabled="loading"
                    id="modify-patient-btn"
                >
                    {{ dialogTitle }}
                </button>
                <button 
                    class="secondary" 
                    @click="closeDialog" 
                    formnovalidate
                    type="button"
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

#modify-patient-btn:disabled{
    cursor: progress;
}

</style>