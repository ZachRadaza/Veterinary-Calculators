<script setup>
import { computed, ref, watch } from 'vue';
import Header from '../components/Header.vue';
import PatientChooser from '../components/PatientChooser.vue';
import { usePatient } from '../composables/Patient.js';
import DialogModifyPatient from '../components/dialogs/DialogModifyPatient.vue';
import DialogBoolean from '../components/dialogs/DialogBoolean.vue';
import { useCalculation } from '../composables/Calculation.js';
import router from '../router/index.js';
import { CalculatorTypes } from '../calculators/CaclulatorTypes.js';
import DialogSaveCalculation from '../components/dialogs/DialogSaveCalculation.vue';

const patient = usePatient();
const calculation = useCalculation();

// patients values
const disablePatientModifyBtns = computed(() => patient.currentPatientId.value <= 0);
const dialogModifyPatient = ref(null);
const isPatientEditing = ref(false);
const dialogDeletePatientConfirm = ref(null);

watch(patient.currentPatientId, async (patId) => {
    await calculation.loadAllPatientSavedCalculations(patId);
    selectedCalculationId.value = -1;
});

function handleAddPatient(){
    patient.changeCurrentPatientId(-1);
    isPatientEditing.value = false;
    dialogModifyPatient.value.openDialog();
}

function handleEditPatient(){
    isPatientEditing.value = true;
    dialogModifyPatient.value.openDialog();
}

async function handleDeletePatient(){
    dialogDeletePatientConfirm.value?.openDialog();
}

//calculation values
const calculatorTypesIdToName = new Map(
    Object.values(CalculatorTypes).map(({ calculatorId, name }) => [
        calculatorId,
        name
    ])
);

const selectedCalculationId = ref(-1);
const selectedCalculation = computed(() => calculation.getCalculation(selectedCalculationId.value));
const dialogSaveCalcuation = ref(null);
const disableCalculationModifyBtns = computed(() =>
    selectedCalculationId.value <= 0 || patient.currentPatientId.value <= 0
);

function handleOpenCalculation(calculationId){
    const selectedCalculation = calculation.getCalculation(calculationId);
    const calculatorName = calculatorTypesIdToName.get(selectedCalculation.calculatorId);

    if(calculatorName)
        router.push({ 
            name: calculatorName, 
            query: { calculationId, patientId: patient.currentPatientId.value }
        });
}

function handleEditCalculation(){


    dialogSaveCalcuation.value?.openDialog();
}

function handleRemoveCalculation(){
    const patientId = patient.currentPatientId.value;
    const calculationId = selectedCalculationId.value;
    calculation.deleteCalculation(patientId, calculationId);
}

function handleStartNewCalculation(){
    const patientId = patient.currentPatientId.value;

    router.push({ name: 'home', query: { patientId }})
}

</script>
<template>
    <Header />
    <body>
        <div class="content-wrapper">
            <div class="content-container">
                <div class="patients-area content-area">
                    <h4 class="header-title">Patients</h4>
                    <div class="patients-cont">

                        <div 
                            class="patients-list" 
                            v-if="patient.patientsList.value.length > 0"
                        >
                            <button v-for="pat in patient.patientsList.value" 
                                :key="pat.id"
                                :class="`list-btn secondary ${pat.id === patient.currentPatientId.value ? 'selected' : ''}`"
                                @click="patient.changeCurrentPatientId(pat.id)"
                            >
                                {{ pat?.name }}
                            </button>
                        </div>

                        <div class="patients-list-empty" v-else>
                            <h5>No Saved Patients</h5>
                        </div>

                    </div>
                    <div class="buttons-cont">
                        <button @click="handleAddPatient">Add Patient</button>
                        <button 
                            @click="handleEditPatient"
                            :disabled="disablePatientModifyBtns"
                        >
                            Edit/View Patient
                        </button>
                        <button 
                            @click="handleDeletePatient"
                            :disabled="disablePatientModifyBtns"
                        >
                            Remove Patient
                        </button>
                        <button @click="patient.changeCurrentPatientId(-1)">Clear Selection</button>
                    </div>
                </div>
                <div class="calculations-area content-area">
                    <h4 class="header-title">Calculations</h4>
                    <div class="calculations-cont">

                        <div 
                            class="calculations-list" 
                            v-if="calculation.calculations?.value?.length > 0"
                        >
                            <button 
                                v-for="savedCalc in calculation.calculations.value"
                                :class="`list-btn secondary ${savedCalc.id === selectedCalculationId ? 'selected' : ''}`"
                                @click="selectedCalculationId = savedCalc.id"
                                @dblclick="handleOpenCalculation(savedCalc.id)"
                            >
                                {{ savedCalc.title }}
                            </button>
                        </div>

                        <div v-else class="calculations-list-empty">
                            <h5>No Saved Calculations</h5>
                        </div>
                    </div>
                    <div class="buttons-cont">
                        <button 
                            @click="handleOpenCalculation(selectedCalculationId)"
                            :disabled="disableCalculationModifyBtns"
                        >Open</button>
                        <button 
                            @click="handleEditCalculation"
                            :disabled="disableCalculationModifyBtns"
                        >Edit/View Info</button>
                        <button 
                            @click="handleRemoveCalculation"
                            :disabled="disableCalculationModifyBtns"
                        >Remove Calculation</button>
                        <button @click="handleStartNewCalculation">Start New</button> 
                    </div>
                </div>
            </div>
            <PatientChooser />
        </div>

        <DialogModifyPatient 
            ref="dialogModifyPatient"
            :is-editing="isPatientEditing"
        />

        <DialogBoolean 
            title="Confirm Delete Patient"
            ref="dialogDeletePatientConfirm"
            :descriptions="['Are you sure you want to delete this patient? This action cannot be undone.']"
            :option-true="{ 
                text: 'Delete Patient', 
                action: async () => {
                    await patient.deletePatient(patient.currentPatientId.value);
                    patient.setCurrentPatientId(-1);
                }}"
            :option-false="{ text: 'Cancel', action: () => dialogDeletePatientConfirm.closeDialog() }"
        />

        <DialogSaveCalculation 
            ref="dialogSaveCalcuation"
            :is-editing="true"
            :existing-title="selectedCalculation?.title"
            :existing-comments="selectedCalculation?.comments"
            :calculation-id="selectedCalculationId"
        />
    </body>
</template>
<style scoped>

.content-wrapper{
    display: flex;
    flex-direction: column;
    border-radius: 1rem;
    border: 0.2rem solid var(--color-primary);
    margin: 1rem;
    box-sizing: border-box;
    overflow: hidden;
}

.content-container{
    display: grid;
    grid-template-columns: 4fr 6fr;
}

.header-title{
    padding: 1rem;
    background: var(--color-secondary);
    color: var(--color-bg);
}

.content-area{
    display: flex;
    flex-direction: column;
}

.content-area :is(.patients-cont, .calculations-cont){
    min-height: 400px;
    max-height: 600px;
    overflow: auto;
    height: 100%;
}

.buttons-cont{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--color-bg-secondary);
    border-top: 0.1rem solid var(--color-primary);
}

.calculations-area{
    border-left: 0.2rem solid var(--color-primary);
}

.patients-list, .calculations-list{
    display: flex;
    flex-direction: column;
}

.calculations-list-empty, .patients-list-empty{
    padding: 2rem;
}

.calculations-list-empty h5, .patients-list-empty h5{
    text-align: center;
}

.list-btn{
    border-radius: 0;
    padding: 1rem 1.4rem;
}

.list-btn.selected, .list-btn:nth-child(odd).selected{
    background: var(--color-secondary);
    color: var(--color-bg);
}

.list-btn:nth-child(odd){
    background: var(--color-bg-secondary);
}

.list-btn:nth-child(odd):is(:hover, :focus){
    background: var(--color-primary);
}

</style>